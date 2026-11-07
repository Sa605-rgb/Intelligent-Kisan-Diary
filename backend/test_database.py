# test_database.py - FIXED VERSION
import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

def test_database():
    try:
        print("🔍 Testing database connection...")
        
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "INTELLIGENT_KISAN_DIARY"),
            port=int(os.getenv("DB_PORT", 3306)),
        )
        
        cursor = conn.cursor()
        
        # 1. Check total records
        cursor.execute("SELECT COUNT(*) FROM crop_history")
        total = cursor.fetchone()[0]
        print(f"✅ 1. Total crop_history records: {total}")
        
        # 2. Check years
        cursor.execute("SELECT DISTINCT year FROM crop_history ORDER BY year")
        years = [row[0] for row in cursor.fetchall()]
        print(f"✅ 2. Years available: {years}")
        
        # 3. Check crop distribution
        cursor.execute("""
            SELECT crop_name, COUNT(*) as count 
            FROM crop_history 
            WHERE yield_per_40kg IS NOT NULL 
            GROUP BY crop_name 
            ORDER BY count DESC
        """)
        print("✅ 3. Crop distribution:")
        crops_data = cursor.fetchall()
        for crop, count in crops_data:
            print(f"   - {crop}: {count}")
        
        # 4. Check if we have required data
        required_years = 5  # Need 5+ years of data
        if len(years) >= required_years:
            print(f"✅ 4. Sufficient years of data ({len(years)} years)")
        else:
            print(f"❌ 4. Insufficient data: only {len(years)} years")
        
        # 5. Check sample record (FIXED QUERY)
        cursor.execute("SELECT crop_name, season, year, yield_per_40kg FROM crop_history LIMIT 1")
        sample = cursor.fetchone()
        if sample:
            print(f"✅ 5. Sample record: Crop='{sample[0]}', Season='{sample[1]}', Year={sample[2]}, Yield={sample[3]}")
        
        # 6. Check if tables exist for model training
        print("\n🔍 Checking tables required for model training:")
        
        # Check land_detail table
        cursor.execute("SELECT COUNT(*) FROM land_detail")
        land_count = cursor.fetchone()[0]
        print(f"   - land_detail records: {land_count}")
        
        # Check farmer table
        cursor.execute("SELECT COUNT(*) FROM farmer")
        farmer_count = cursor.fetchone()[0]
        print(f"   - farmer records: {farmer_count}")
        
        # Check city_areas table
        cursor.execute("SELECT COUNT(*) FROM city_areas")
        city_count = cursor.fetchone()[0]
        print(f"   - city_areas records: {city_count}")
        
        conn.close()
        return True
        
    except Error as e:
        print(f"❌ Database error: {e}")
        print("\n⚠️ Check:")
        print("1. MySQL server is running")
        print("2. Database 'INTELLIGENT_KISAN_DIARY' exists")
        print("3. Username/password is correct")
        return False

if __name__ == "__main__":
    print("="*50)
    print("DATABASE CONNECTION TEST")
    print("="*50)
    
    success = test_database()
    
    print("="*50)
    if success:
        print("🎯 Database check PASSED! Ready for retraining.")
        print("\nNext step: Run 'python first_retrain.py'")
    else:
        print("❌ Database check FAILED! Fix connection first.")
    print("="*50)