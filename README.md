# Intelligent Kisan Diary

AI-powered mobile app for Pakistani farmers: crop recommendation, fertilizer and pesticide logging, weather, and farm activity diary.

FYP stack: **React Native** frontend + **FastAPI** backend + **MySQL** + a scikit-learn crop model (`backend/models/`).

## Features

- Crop recommendation from city, season, and soil (trained model + encoders)
- Farmer signup/login, land records, crop/fertilizer/pesticide entries
- Public feed, neighbour crops, history, admin dashboard
- Live weather for Pakistani cities
- Urdu / English UI

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# edit .env with your MySQL password
uvicorn main:app --reload
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

## Frontend (React Native)

```bash
cd frontend
npm install
npm start
npm run android
```

Point `frontend/api.js` at your backend URL.

## Repo notes

`node_modules`, Python venvs, and `.env` are not committed. Copy `backend/.env.example` to `backend/.env` locally.
