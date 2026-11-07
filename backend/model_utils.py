



from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import pickle
from datetime import datetime
import os
from pathlib import Path
import mysql.connector
import warnings
from collections import Counter

# SMOTE & NearMiss imports
try:
    from imblearn.over_sampling import SMOTE
    from imblearn.under_sampling import NearMiss
    IMBLEARN_AVAILABLE = True
except Exception as e:
    IMBLEARN_AVAILABLE = False

router = APIRouter()

# 1) Load Model + Encoders
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "models" / "crop_model.pkl"
CITY_PATH = BASE_DIR / "models" / "city_encoder.pkl"
CROP_PATH = BASE_DIR / "models" / "crop_encoder.pkl"
SEASON_PATH = BASE_DIR / "models" / "season_encoder.pkl"
SOIL_PATH = BASE_DIR / "models" / "soil_encoder.pkl"

try:
    model = pickle.load(open(MODEL_PATH, "rb"))
    le_city = pickle.load(open(CITY_PATH, "rb"))
    le_crop = pickle.load(open(CROP_PATH, "rb"))
    le_season = pickle.load(open(SEASON_PATH, "rb"))
    le_soil = pickle.load(open(SOIL_PATH, "rb"))
except Exception as e:
    model = None

# 2) City, Soil, Crop, Season Info
city_soil = {
    "RAWALPINDI": ["CLAY LOAM", "SILT LOAM"],
    "FAISALABAD": ["SANDY LOAM", "CLAY"],
    "LAHORE": ["LOAM", "CLAY LOAM"],
    "MULTAN": ["SANDY CLAY", "LOAM"],
    "GUJRAT": ["LOAM", "SILT"],
    "SIALKOT": ["CLAY LOAM", "SANDY LOAM"]
}

season_allowed = {
    "RABI": ["WHEAT", "MUSTARD", "BARLEY", "CHANA"],
    "KHARIF": ["RICE", "COTTON", "MAIZE", "PEANUT",
               "SESAMUM", "SUNFLOWER", "BAJRA", "JOWAR", "SUGARCANE"]
}

# CROP NAME TRANSLATION (Urdu ↔ English)
CROP_URDU_TO_ENGLISH = {
    "چاول": "RICE", "دھان": "RICE", "کپاس": "COTTON", "مکئی": "MAIZE",
    "مونگ پھلی": "PEANUT", "تل": "SESAMUM", "سورج مکھی": "SUNFLOWER",
    "باجرہ": "BAJRA", "باجرا": "BAJRA", "جوار": "JOWAR", "گنا": "SUGARCANE",
    "تمباکو": "TOBACCO", "گندم": "WHEAT", "سرسوں": "MUSTARD", 
    "جو": "BARLEY", "چنا": "CHANA", "چنے": "CHANA",
}

CROP_ENGLISH_TO_URDU = {v: k for k, v in CROP_URDU_TO_ENGLISH.items()}

def normalize_crop_name(crop_name: str) -> str:
    if not crop_name:
        return ""
    crop_name = crop_name.strip()
    if crop_name in CROP_URDU_TO_ENGLISH:
        return CROP_URDU_TO_ENGLISH[crop_name]
    return crop_name.upper()

# 3) Pydantic Request Model
class CropRequest(BaseModel):
    city: str
    season: str
    soil: str

# 4) Crop Recommendation Logic (Model 1)
def recommend_crops(city, season, soil_type):
    city = city.upper().strip()
    season = season.upper().strip()
    soil_type = soil_type.upper().strip()
    year = datetime.now().year

    if city not in city_soil:
        return {"error": f"City '{city}' not found"}

    city_code = le_city.transform([city])[0]
    season_code = le_season.transform([season])[0]
    soil_code = le_soil.transform([soil_type])[0]
    valid_crops = season_allowed[season]

    results = []
    for crop in valid_crops:
        crop_code = le_crop.transform([crop])[0]
        X_test = pd.DataFrame([[city_code, season_code, crop_code, soil_code, year]],
                              columns=["city_encoded", "season_encoded", "crop_encoded", "soil_encoded", "year"])
        pred = model.predict(X_test)[0]
        results.append({"crop": crop, "predicted_production": float(pred)})

    results = sorted(results, key=lambda x: x["predicted_production"], reverse=True)
    return results[:2]

@router.post("/recommend")
def recommend(request: CropRequest):
    recommendations = recommend_crops(request.city, request.season, request.soil)
    return {
        "city": request.city, 
        "season": request.season, 
        "soil": request.soil, 
        "recommendations": recommendations
    }

# 5) Database Config & Connection
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "INTELLIGENT_KISAN_DIARY"),
}

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Exception as e:
        return None

# 6) Get RAW Crop Data for SMOTE/NearMiss
def get_raw_crop_data(city_area_id: int):
    conn = get_db_connection()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT 
            ch.id,
            ch.crop_name,
            ch.yield_per_40kg as yield_value,
            ld.area_size as area,
            ch.year,
            mr.retail_rate as price
        FROM crop_history ch
        LEFT JOIN market_rate mr ON 
            LOWER(mr.item_name) = LOWER(ch.crop_name) AND
            mr.year = ch.year AND
            mr.season = ch.season
        JOIN land_detail ld ON ch.land_id = ld.id
        JOIN city_areas ca ON ld.city_areas_id = ca.id
        WHERE ch.season = 'KHARIF'
            AND ch.year <= YEAR(CURDATE())
            AND ld.city_areas_id = %s
            AND ch.yield_per_40kg IS NOT NULL
        """
        
        cursor.execute(query, (city_area_id,))
        raw_data = cursor.fetchall()
        cursor.close()
        conn.close()
        return raw_data
        
    except Exception:
        return []

def balance_raw_crop_data(raw_data):
    if not raw_data or len(raw_data) < 6:
        return raw_data, {
            "method": "none",
            "reason": "insufficient_raw_data",
            "original_count": len(raw_data) if raw_data else 0
        }
    
    X_data = []
    y_labels = []
    
    for record in raw_data:
        yield_val = float(record.get('yield_value', 0) or 0)
        area = float(record.get('area', 0) or 0)
        price = float(record.get('price', 0) or 2000)
        year = int(record.get('year', 2023))
        revenue = yield_val * price
        
        features = [yield_val, area, price, revenue, year]
        X_data.append(features)
        y_labels.append(record.get('crop_name', 'UNKNOWN'))
    
    X = np.array(X_data)
    y = np.array(y_labels)
    
    class_counts = Counter(y)
    min_samples = min(class_counts.values())
    max_samples = max(class_counts.values())
    
    balance_info = {
        "original_distribution": dict(class_counts),
        "original_count": len(y),
        "min_class_samples": min_samples,
        "max_class_samples": max_samples
    }
    
    if min_samples < 2:
        balance_info["method"] = "none"
        balance_info["reason"] = f"minority_class_has_only_{min_samples}_sample(s)"
        return raw_data, balance_info
    
    imbalance_ratio = min_samples / max_samples
    
    if imbalance_ratio < 0.3:
        balance_info["method"] = "SMOTE"
        if IMBLEARN_AVAILABLE:
            try:
                k_neighbors = min(5, min_samples - 1)
                smote = SMOTE(random_state=42, k_neighbors=max(1, k_neighbors))
                X_balanced, y_balanced = smote.fit_resample(X, y)
                balance_info["result"] = "smote_applied"
                balance_info["balanced_distribution"] = dict(Counter(y_balanced))
            except Exception:
                balance_info["result"] = "smote_error"
                X_balanced, y_balanced = X, y
        else:
            balance_info["result"] = "imblearn_not_installed"
            X_balanced, y_balanced = X, y
    else:
        balance_info["method"] = "NearMiss"
        if IMBLEARN_AVAILABLE:
            try:
                n_neighbors = min(3, min_samples)
                nearmiss = NearMiss(version=1, n_neighbors=max(1, n_neighbors))
                X_balanced, y_balanced = nearmiss.fit_resample(X, y)
                balance_info["result"] = "nearmiss_applied"
                balance_info["balanced_distribution"] = dict(Counter(y_balanced))
            except Exception:
                balance_info["result"] = "nearmiss_error"
                X_balanced, y_balanced = X, y
        else:
            balance_info["result"] = "imblearn_not_installed"
            X_balanced, y_balanced = X, y
    
    balanced_records = []
    for i in range(len(y_balanced)):
        balanced_records.append({
            'crop_name': y_balanced[i],
            'yield_value': float(X_balanced[i][0]),
            'area': float(X_balanced[i][1]),
            'price': float(X_balanced[i][2]),
            'revenue': float(X_balanced[i][3]),
            'year': int(X_balanced[i][4])
        })
    
    balance_info["balanced_count"] = len(balanced_records)
    return balanced_records, balance_info

def aggregate_balanced_data(balanced_records, original_frequency=None):
    if not balanced_records:
        return []
    
    crop_groups = {}
    for record in balanced_records:
        crop_name = record['crop_name']
        if crop_name not in crop_groups:
            crop_groups[crop_name] = []
        crop_groups[crop_name].append(record)
    
    crop_revenues = []
    total_original_freq = sum(original_frequency.values()) if original_frequency else 1
    
    for crop_name, records in crop_groups.items():
        yields = [float(r.get('yield_value') or 0) for r in records]
        prices = [float(r.get('price') or 2000) for r in records]
        areas = [float(r.get('area') or 0) for r in records]
        
        avg_yield = sum(yields) / len(records) if records else 0
        avg_price = sum(prices) / len(records) if records else 0
        avg_area = sum(areas) / len(records) if records else 0
        total_revenue = float(avg_yield) * float(avg_price)
        frequency = len(records)
        
        orig_freq = original_frequency.get(crop_name, 0) if original_frequency else frequency
        freq_percentage = (orig_freq / total_original_freq) * 100 if total_original_freq > 0 else 0
        
        crop_revenues.append({
            'crop': crop_name,
            'revenue': total_revenue,
            'frequency': frequency,
            'original_frequency': orig_freq,
            'freq_percentage': round(freq_percentage, 1),
            'avg_yield': avg_yield,
            'avg_price': avg_price,
            'avg_area': avg_area
        })
    
    if crop_revenues:
        max_revenue = max(c['revenue'] for c in crop_revenues)
        for crop in crop_revenues:
            revenue_score = (crop['revenue'] / max_revenue) * 100 if max_revenue > 0 else 0
            freq_score = crop['freq_percentage']
            crop['combined_score'] = (revenue_score * 0.5) + (freq_score * 0.5)
    
    crop_revenues.sort(key=lambda x: x.get('combined_score', 0), reverse=True)
    return crop_revenues

# 7) Get Crop Revenue Data (with SMOTE/NearMiss)
def get_crop_revenue_data(city_area_id: int, apply_balancing: bool = False):
    balance_info = {}
    
    if apply_balancing and IMBLEARN_AVAILABLE:
        raw_data = get_raw_crop_data(city_area_id)
        
        if raw_data and len(raw_data) >= 6:
            balanced_records, balance_info = balance_raw_crop_data(raw_data)
            original_frequency = balance_info.get('original_distribution', {})
            crop_revenues = aggregate_balanced_data(balanced_records, original_frequency)
            
            if crop_revenues:
                return crop_revenues, balance_info
        else:
            balance_info = {"method": "none", "reason": "insufficient_raw_data"}
    
    conn = get_db_connection()
    if not conn:
        return [], balance_info
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT 
            ch.crop_name,
            COUNT(ch.id) as frequency,
            AVG(ch.yield_per_40kg) as avg_yield,
            AVG(mr.retail_rate) as avg_price,
            AVG(ld.area_size) as avg_area
        FROM crop_history ch
        LEFT JOIN market_rate mr ON 
            LOWER(mr.item_name) = LOWER(ch.crop_name) AND
            mr.year = ch.year AND
            mr.season = ch.season
        JOIN land_detail ld ON ch.land_id = ld.id
        JOIN city_areas ca ON ld.city_areas_id = ca.id
        WHERE ch.season = 'KHARIF'
            AND ch.year <= YEAR(CURDATE())
            AND ld.city_areas_id = %s
            AND ch.yield_per_40kg IS NOT NULL
        GROUP BY ch.crop_name
        HAVING avg_yield IS NOT NULL
        """
        
        cursor.execute(query, (city_area_id,))
        crops_data = cursor.fetchall()
        
        crop_revenues = []
        for crop in crops_data:
            crop_name = crop['crop_name']
            avg_yield = crop['avg_yield']
            avg_price = crop['avg_price']
            
            if not avg_price:
                continue
            
            revenue = avg_yield * avg_price
            
            crop_revenues.append({
                'crop': crop_name,
                'revenue': revenue,
                'frequency': crop['frequency'],
                'avg_yield': avg_yield,
                'avg_price': avg_price,
                'avg_area': crop['avg_area']
            })
        
        cursor.close()
        conn.close()
        
        crop_revenues.sort(key=lambda x: x['revenue'], reverse=True)
        
        if not balance_info:
            balance_info = {"method": "none", "reason": "balancing_not_requested_or_fallback"}
        
        return crop_revenues, balance_info
        
    except Exception:
        return [], balance_info

# CITY-BASED FUNCTIONS (with SMOTE/NearMiss)
def get_raw_crop_data_by_city(city_name: str, season: str):
    conn = get_db_connection()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT 
            ch.id,
            ch.crop_name,
            ch.yield_per_40kg as yield_value,
            ld.area_size as area,
            ch.year,
            mr.retail_rate as price
        FROM crop_history ch
        LEFT JOIN market_rate mr ON 
            LOWER(mr.item_name) = LOWER(ch.crop_name) AND
            mr.year = ch.year AND
            mr.season = ch.season
        JOIN land_detail ld ON ch.land_id = ld.id
        JOIN city_areas ca ON ld.city_areas_id = ca.id
        JOIN city c ON ca.city_id = c.id
        WHERE UPPER(ch.season) = %s
            AND ch.year <= YEAR(CURDATE())
            AND UPPER(c.city_name) = %s
            AND ch.yield_per_40kg IS NOT NULL
        """
        
        cursor.execute(query, (season.upper(), city_name.upper()))
        raw_data = cursor.fetchall()
        cursor.close()
        conn.close()
        return raw_data
        
    except Exception:
        return []

def get_crop_revenue_by_city(city_name: str, season: str, apply_balancing: bool = True):
    balance_info = {"method": "none", "reason": "not_applied"}
    
    if apply_balancing and IMBLEARN_AVAILABLE:
        raw_data = get_raw_crop_data_by_city(city_name, season)
        
        if raw_data and len(raw_data) >= 6:
            balanced_records, balance_info = balance_raw_crop_data(raw_data)
            original_frequency = balance_info.get('original_distribution', {})
            crop_revenues = aggregate_balanced_data(balanced_records, original_frequency)
            
            if crop_revenues:
                return crop_revenues, balance_info
        else:
            balance_info = {"method": "none", "reason": "insufficient_data_for_balancing"}
  
    conn = get_db_connection()
    if not conn:
        return [], balance_info
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT 
            ch.crop_name,
            COUNT(ch.id) as frequency,
            AVG(ch.yield_per_40kg) as avg_yield,
            AVG(mr.retail_rate) as avg_price,
            AVG(ld.area_size) as avg_area
        FROM crop_history ch
        LEFT JOIN market_rate mr ON 
            LOWER(mr.item_name) = LOWER(ch.crop_name) AND
            mr.year = ch.year AND
            mr.season = ch.season
        JOIN land_detail ld ON ch.land_id = ld.id
        JOIN city_areas ca ON ld.city_areas_id = ca.id
        JOIN city c ON ca.city_id = c.id
        WHERE UPPER(ch.season) = %s
            AND ch.year <= YEAR(CURDATE())
            AND UPPER(c.city_name) = %s
            AND ch.yield_per_40kg IS NOT NULL
        GROUP BY ch.crop_name
        HAVING avg_yield IS NOT NULL
        """
        
        cursor.execute(query, (season.upper(), city_name.upper()))
        crops_data = cursor.fetchall()
        
        crop_revenues = []
        for crop in crops_data:
            crop_name = crop['crop_name']
            avg_yield = crop['avg_yield']
            avg_price = crop['avg_price']
            
            if not avg_price:
                continue
            
            revenue = avg_yield * avg_price
            
            crop_revenues.append({
                'crop': crop_name,
                'revenue': revenue,
                'frequency': crop['frequency'],
                'avg_yield': avg_yield,
                'avg_price': avg_price
            })
        
        cursor.close()
        conn.close()
        
        crop_revenues.sort(key=lambda x: x['revenue'], reverse=True)
        return crop_revenues, balance_info
        
    except Exception:
        return [], balance_info

# 🌾 MAIN ENDPOINT: /recommend_best
@router.post("/recommend_best")
def recommend_best(request: CropRequest):
    city = request.city.upper().strip()
    season = request.season.upper().strip()
    soil = request.soil.upper().strip()
   
    # STEP 1: ML MODEL - 2 Best Crops (English names)
    ml_top_2 = []
    
    if model and city in city_soil:
        try:
            ml_results = recommend_crops(city, season, soil)
            if isinstance(ml_results, list):
                ml_top_2 = [item['crop'] for item in ml_results[:2]]
        except Exception:
            pass
    
    # STEP 2: DATABASE - 2 Best Crops (may be Urdu names)
    db_top_2_original = []
    db_top_2_normalized = []
    balance_info = {}
    
    crop_revenues, balance_info = get_crop_revenue_by_city(city, season, apply_balancing=True)
    if crop_revenues:
        db_top_2_original = [crop['crop'] for crop in crop_revenues[:2]]
        db_top_2_normalized = [normalize_crop_name(crop) for crop in db_top_2_original]
   
    # STEP 3: COMBINE → Final 2 (using normalized names)
    crop_scores = {}
    
    for i, crop in enumerate(ml_top_2):
        normalized = normalize_crop_name(crop)
        crop_scores[normalized] = crop_scores.get(normalized, 0) + (100 - i * 20)
    
    for i, crop in enumerate(db_top_2_normalized):
        crop_scores[crop] = crop_scores.get(crop, 0) + (100 - i * 20)
    
    sorted_crops = sorted(crop_scores.items(), key=lambda x: x[1], reverse=True)
    final_2 = [crop[0] for crop in sorted_crops[:2]]
    
    return {
        "city": city,
        "season": season,
        "soil": soil,
        "recommended_crops": final_2,
        "data_balancing": balance_info,
        "analysis": {
            "ml_model_top_2": ml_top_2,
            "database_top_2_original": db_top_2_original,
            "database_top_2_normalized": db_top_2_normalized,
            "combined_scores": dict(sorted_crops)
        }
    }