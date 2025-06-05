# NutrIA

## Overview

This repository contains a FastAPI backend for generating nutrition and training plans, an Express server for user authentication, and a React frontend. It also includes scripts to train machine learning models used by the backend.

## Requirements

- Python 3.10+
- Node.js 16+
- npm

## Environment variables

Create a `.env` file in the repository root with the following values:

```
JWT_SECRET=<secret used by backend/server.mjs>
PORT=5000                 # Express server port
FASTAPI_PORT=8000         # Port for FastAPI (used with uvicorn)
REACT_APP_API_URL=http://localhost:${FASTAPI_PORT}
REACT_APP_AUTH_URL=http://localhost:${PORT}
```

`JWT_SECRET` is required by the Express server when signing tokens. `REACT_APP_API_URL` and `REACT_APP_AUTH_URL` should point to the FastAPI and Express servers so the React application knows where to send API calls.

## Starting the services

### FastAPI backend

Install Python dependencies and start the server using uvicorn:

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload --port ${FASTAPI_PORT}
```

The main application is defined in `backend/main.py` where the FastAPI instance is created and endpoints such as `/generate_plan/` are defined.

### Express server

Install Node dependencies at the repository root and run the server:

```bash
npm install
node backend/server.mjs
```

The server listens on `PORT` and uses `JWT_SECRET` when creating tokens.

### React frontend

From the `frontend` folder install dependencies and start the development server:

```bash
cd frontend
npm install
npm start
```

The frontend makes requests to the FastAPI and Express APIs using the base URLs defined in `.env`.

## Machine learning training

The script `backend/train_model.py` generates synthetic training data, trains regression and classification models with scikit-learn, and saves the artifacts with joblib. Running it creates the following files in the repository:

- `calories_model.pkl`
- `exercise_model.pkl`
- `le_activity.pkl`
- `le_exercise.pkl`
- `le_gender.pkl`
- `scaler.pkl`

These models are loaded by the backend to compute recommendations.

