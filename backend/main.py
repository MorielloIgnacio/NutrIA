from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from typing import List, Optional

from .db import SessionLocal, init_db
from .db_models import NutritionPlan

app = FastAPI()

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/reset-plan")
async def reset_plan(db: Session = Depends(get_db)):
    plan = db.query(NutritionPlan).filter(NutritionPlan.user_id == 1).first()
    if plan:
        db.delete(plan)
        db.commit()
    return {"success": True}

@app.get("/api/check-plan")
async def check_plan(db: Session = Depends(get_db)):
    plan = db.query(NutritionPlan).filter(NutritionPlan.user_id == 1).first()
    if plan:
        plan_data = {
            "nutrition_plan": {
                "calories": plan.calories,
                "protein": plan.protein,
                "carbs": plan.carbs,
                "fats": plan.fats,
            },
            "exercise_plan": plan.exercise_plan,
        }
        return {"hasPlan": True, "plan": plan_data}
    return {"hasPlan": False, "plan": None}


# Datos que recibimos del frontend

class UserData(BaseModel):
    weight: float = Field(..., description="Peso del usuario en Kilogramos")
    height: float = Field(..., description="Altura del usuario en centímetros")
    age: int = Field(..., description="Edad del usuario")
    gender: str = Field(
        ...,
        pattern="^(male|female)$",
        description="Genero del usuario; valores permitidos: 'male' o 'female'",
    )
    activity_level: str = Field(..., pattern="^(sedentary|lightly_active|moderately_active|very_active|super_active)$", description="Activity level")
    goals: List[str] = Field(..., description="Fitness goals of the user")
    routine_preference: str = Field(..., description="User's exercise routine preference as a string")
    dietary_restrictions: Optional[List[str]] = Field(default=[], description="Dietary restrictions if any")


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
    tmb = calcular_tmb(data.weight, data.height, data.age, data.gender)
    tdee = calcular_tdee(tmb, data.activity_level)
    
    calorias_ajustadas = tdee
    
    plan_macronutrientes = generar_plan_macronutrientes(calorias_ajustadas, data.goals)
    exercise_plan = generar_rutina_ejercicio(data.activity_level, data.routine_preference)

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
def generate_plan(user_data: UserData, db: Session = Depends(get_db)):
    # Validar el nivel de actividad
    if user_data.activity_level not in ["sedentary", "lightly_active", "moderately_active", "very_active", "super_active"]:
        raise HTTPException(status_code=400, detail="Nivel de actividad inválido")
    
    # Generar recomendaciones
    recommendations = generate_recommendations(user_data)

    plan = db.query(NutritionPlan).filter(NutritionPlan.user_id == 1).first()
    if plan:
        plan.calories = recommendations["nutrition_plan"]["calories"]
        plan.protein = recommendations["nutrition_plan"]["protein"]
        plan.carbs = recommendations["nutrition_plan"]["carbs"]
        plan.fats = recommendations["nutrition_plan"]["fats"]
        plan.exercise_plan = recommendations["exercise_plan"]
    else:
        plan = NutritionPlan(
            user_id=1,
            calories=recommendations["nutrition_plan"]["calories"],
            protein=recommendations["nutrition_plan"]["protein"],
            carbs=recommendations["nutrition_plan"]["carbs"],
            fats=recommendations["nutrition_plan"]["fats"],
            exercise_plan=recommendations["exercise_plan"],
        )
        db.add(plan)
    db.commit()
    return recommendations
