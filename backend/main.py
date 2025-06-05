from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from pathlib import Path
import joblib
import numpy as np

app = FastAPI()

# Paths to the trained models
BASE_DIR = Path(__file__).resolve().parent.parent
calories_model = joblib.load(BASE_DIR / "calories_model.pkl")
exercise_model = joblib.load(BASE_DIR / "exercise_model.pkl")
scaler = joblib.load(BASE_DIR / "scaler.pkl")
le_gender = joblib.load(BASE_DIR / "le_gender.pkl")
le_activity = joblib.load(BASE_DIR / "le_activity.pkl")
le_exercise = joblib.load(BASE_DIR / "le_exercise.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/reset-plan")
async def reset_plan():
    # Lógica para restablecer el plan del usuario (por ejemplo, eliminarlo de la base de datos)
    return {"success": True}

@app.get("/api/check-plan")
async def check_plan():
    # Simulación de respuesta; ajusta según tu lógica
    user_has_plan = True  # Cambia esto a la lógica real para verificar el plan
    plan_data = {"name": "Plan de ejemplo"} if user_has_plan else None
    return {"hasPlan": user_has_plan, "plan": plan_data}


# Datos que recibimos del frontend
from pydantic import BaseModel, Field
from typing import List, Optional

class UserData(BaseModel):
    weight: float = Field(..., description="Peso del usuario en Kilogramos")
    height: float = Field(..., description="Altura del usuario en centimentros")
    age: int = Field(..., description="Edad del usuario")
    gender: str = Field(..., pattern="^(male|female)$", description="Genero del usuario, 'Masculino' o 'Femenino'")
    activity_level: str = Field(..., pattern="^(sedentary|lightly_active|moderately_active|very_active|super_active)$", description="Activity level")
    goals: List[str] = Field(..., description="Fitness goals of the user")
    routine_preference: str = Field(..., description="User's exercise routine preference as a string")
    dietary_restrictions: Optional[List[str]] = Field(default=[], description="Dietary restrictions if any")
    disliked_foods: Optional[str] = Field(default=None, description="Foods the user dislikes")
    body_fat: Optional[float] = Field(default=None, description="Body fat percentage")
    muscle_mass: Optional[float] = Field(default=None, description="Muscle mass in kilograms")
    heart_rate: Optional[float] = Field(default=None, description="Resting heart rate")
    steps: Optional[int] = Field(default=None, description="Daily steps from smart devices")


# Funciones para calcular TMB, TDEE y ajustar calorías
def calcular_tmb(weight, height, age, gender):
    if gender == 'male':
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

def calcular_tdee(tmb, activity_level):
    activity_factors = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'super_active': 1.9
    }
    return tmb * activity_factors[activity_level]

# Generar el plan de macronutrientes según las calorías ajustadas
def generar_plan_macronutrientes(calories, goals):
    if 'Ganar masa muscular' in goals:
        protein_ratio = 0.35
        carb_ratio = 0.45
        fat_ratio = 0.20
    elif 'Perder peso' in goals:
        protein_ratio = 0.40
        carb_ratio = 0.35
        fat_ratio = 0.25
    else:
        protein_ratio = 0.30
        carb_ratio = 0.50
        fat_ratio = 0.20

    protein_grams = max((calories * protein_ratio) / 4, 0)
    carb_grams = max((calories * carb_ratio) / 4, 0)
    fat_grams = max((calories * fat_ratio) / 9, 0)

    return {
        'proteins': protein_grams,
        'carbs': carb_grams,
        'fats': fat_grams
    }

# Generar el plan de ejercicios según las preferencias y nivel de actividad
def generar_rutina_ejercicio(activity_level, routine_preference):
    routines = {
        'Ejercicio en casa': "Rutina en casa con bandas elásticas y pesas.",
        'Ejercicio en el gimnasio': "Entrenamiento en el gimnasio con pesas y HIIT.",
        'Ejercicio al aire libre': "Correr, ciclismo o entrenamiento funcional al aire libre.",
        'No estoy seguro': "Ejercicios mixtos, combinando diferentes tipos de entrenamiento."
    }

    # Convertimos la cadena en una lista de rutinas separadas por comas
    selected_routines = [routines[pref.strip()] for pref in routine_preference.split(',') if pref.strip() in routines]
    
    return " / ".join(selected_routines) if selected_routines else "Rutina personalizada sugerida según nivel de actividad."

# Reglas para generar recomendaciones
def generate_recommendations(data: UserData):
    body_fat = data.body_fat or 0.0
    muscle_mass = data.muscle_mass or 0.0
    heart_rate = data.heart_rate or 0.0
    steps = data.steps or 0

    gender_encoded = le_gender.transform([data.gender])[0]
    activity_encoded = le_activity.transform([data.activity_level])[0]
    features = np.array([[
        data.weight,
        data.height,
        data.age,
        gender_encoded,
        activity_encoded,
        body_fat,
        muscle_mass,
        heart_rate,
        steps
    ]])

    calories_scaled = scaler.transform(features)
    calorias_ajustadas = calories_model.predict(calories_scaled)[0]

    exercise_label = exercise_model.predict(features)[0]
    exercise_plan = le_exercise.inverse_transform([exercise_label])[0]

    plan_macronutrientes = generar_plan_macronutrientes(calorias_ajustadas, data.goals)

    return {
        "exercise_plan": exercise_plan,
        "nutrition_plan": {
            "calories": calorias_ajustadas,
            "protein": plan_macronutrientes['proteins'],
            "carbs": plan_macronutrientes['carbs'],
            "fats": plan_macronutrientes['fats']
        }
    }

# Endpoint para generar el plan basado en los datos del usuario
@app.post("/generate_plan/")
def generate_plan(user_data: UserData):
    # Validar el nivel de actividad
    if user_data.activity_level not in ["sedentary", "lightly_active", "moderately_active", "very_active", "super_active"]:
        raise HTTPException(status_code=400, detail="Nivel de actividad inválido")
    
    # Generar recomendaciones
    recommendations = generate_recommendations(user_data)
    return recommendations
