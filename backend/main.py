from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import pandas as pd
import numpy as np
import os
import tensorflow as tf
from fastapi.security import OAuth2PasswordBearer

app = FastAPI()

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cambia a "*" solo en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# Rutas de autenticación y seguridad
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Cargar los datasets usando rutas absolutas
base_dir = os.path.dirname(os.path.abspath(__file__))
ejercicios_path = os.path.join(base_dir, 'data', 'fitness_exercises_enriched.csv')
recetas_path = os.path.join(base_dir, 'data', 'enriched_recipes_data.csv')

ejercicios_df = pd.read_csv(ejercicios_path)
recetas_df = pd.read_csv(recetas_path)

# Preprocesamiento de los datasets
ejercicios_df.dropna(inplace=True)
recetas_df.dropna(inplace=True)

# Calcular las calorías en recetas
recetas_df['Calories'] = (
    recetas_df['Protein(g)'].astype(float) * 4 +
    recetas_df['Carbs(g)'].astype(float) * 4 +
    recetas_df['Fat(g)'].astype(float) * 9
)
ejercicios_df['Calories_Burned'] = ejercicios_df['Calories_Burned'].astype(float)

class UserProfile(BaseModel):
    weight: float
    height: float
    age: int
    gender: str = Field(..., pattern="^(male|female)$")
    activity_level: str = Field(..., pattern="^(sedentary|lightly_active|moderately_active|very_active|super_active)$")
    fitness_goal: str = Field(..., pattern="^(lose_weight|gain_muscle|maintain)$")
    routine_preference: str
    dietary_preferences: Optional[List[str]] = []
    equipment_available: Optional[List[str]] = []
    meals_per_day: int = 3

# Función para cargar el modelo en tiempo de ejecución
def cargar_modelo():
    model_path = os.path.join(base_dir, 'modelo_nutria_lstm.h5')
    try:
        model = tf.keras.models.load_model(model_path)
        return model
    except Exception as e:
        print("Error al cargar el modelo:", e)
        return None

# Funciones de cálculo para TMB y TDEE
def calcular_tmb(weight, height, age, gender):
    if gender == 'male':
        return 10 * weight + 6.25 * height - 5 * age + 5
    else:
        return 10 * weight + 6.25 * height - 5 * age - 161

def calcular_tdee(tmb, activity_level):
    activity_factors = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'super_active': 1.9
    }
    return tmb * activity_factors[activity_level]

def calcular_calorias_diarias(user_profile: UserProfile):
    tmb = calcular_tmb(user_profile.weight, user_profile.height, user_profile.age, user_profile.gender)
    tdee = calcular_tdee(tmb, user_profile.activity_level)

    if user_profile.fitness_goal == 'lose_weight':
        calorias_diarias = tdee - 500
    elif user_profile.fitness_goal == 'gain_muscle':
        calorias_diarias = tdee + 500
    else:
        calorias_diarias = tdee

    return calorias_diarias

def recomendar_ejercicios_con_intensidad(intensidad, user_profile):
    ejercicios_filtrados = ejercicios_df[ejercicios_df['Intensity'] == intensidad]
    
    if user_profile.equipment_available:
        ejercicios_filtrados = ejercicios_filtrados[
            ejercicios_filtrados['equipment'].isin(user_profile.equipment_available)
        ]
    
   
    if ejercicios_filtrados.empty or len(ejercicios_filtrados) < 5:
        ejercicios_filtrados = ejercicios_df[ejercicios_df['equipment'] != 'body weight']
    
    # Selección final de ejercicios
    return ejercicios_filtrados.sample(n=5).to_dict('records') if len(ejercicios_filtrados) >= 5 else ejercicios_filtrados.to_dict('records')


def recomendar_recetas(user_profile: UserProfile):
    calorias_diarias = calcular_calorias_diarias(user_profile)
    calorias_por_comida = calorias_diarias / user_profile.meals_per_day
    if user_profile.dietary_preferences:
        recetas_filtradas = recetas_df[recetas_df['Diet_type'].isin(user_profile.dietary_preferences)]
    else:
        recetas_filtradas = recetas_df
    margen_calorias = 100
    recetas_filtradas = recetas_filtradas[
        (recetas_filtradas['Calories'] >= calorias_por_comida - margen_calorias) &
        (recetas_filtradas['Calories'] <= calorias_por_comida + margen_calorias)
    ]
    recetas_recomendadas = []
    for _ in range(user_profile.meals_per_day):
        if len(recetas_filtradas) > 0:
            receta = recetas_filtradas.sample(n=1).to_dict('records')[0]
            recetas_recomendadas.append(receta)
        else:
            receta = recetas_df.sample(n=1).to_dict('records')[0]
            recetas_recomendadas.append(receta)
    return recetas_recomendadas

def generar_plan_30_dias(user_profile: UserProfile):
    plan_dias = []
    for semana in range(4):  
        ejercicios_semanales = [recomendar_ejercicios_con_intensidad("moderate", user_profile) for _ in range(7)]
        recetas_semanales = [recomendar_recetas(user_profile) for _ in range(7)]
        for dia, (ejercicios_dia, recetas_dia) in enumerate(zip(ejercicios_semanales, recetas_semanales), start=1 + semana * 7):
            dia_plan = {
                "dia": dia,
                "ejercicios": ejercicios_dia,
                "recetas": recetas_dia
            }
            plan_dias.append(dia_plan)
    return {"dias": plan_dias}

@app.post("/predict_progreso")
def predict_progreso(user_data: List[List[float]]):
    model = cargar_modelo()
    if model is None:
        raise HTTPException(status_code=500, detail="Modelo LSTM no cargado.")
    try:
        if len(user_data) != 7 or any(len(day_data) != 5 for day_data in user_data):
            raise HTTPException(status_code=400, detail="Formato de datos inválido. Se esperan 7 días de datos con 5 valores cada uno.")
        
        datos_recientes = np.array(user_data).reshape((1, 7, len(user_data[0])))
        prediccion = model.predict(datos_recientes)
        peso_futuro, rendimiento_futuro, meta_nutricional_futura = prediccion[0]
        return {
            "peso_futuro": peso_futuro,
            "rendimiento_futuro": rendimiento_futuro,
            "meta_nutricional_futura": meta_nutricional_futura
        }
    except Exception as e:
        print("Error en predicción:", e)
        raise HTTPException(status_code=500, detail="Error al hacer la predicción.")

        
@app.post("/generate_plan/")
def generate_plan(user_profile: UserProfile):
    if user_profile.activity_level not in [
        "sedentary", "lightly_active", "moderately_active", "very_active", "super_active"
    ]:
        raise HTTPException(status_code=400, detail="Nivel de actividad inválido")
    if user_profile.fitness_goal not in ["lose_weight", "gain_muscle", "maintain"]:
        raise HTTPException(status_code=400, detail="Objetivo de fitness inválido")
    plan = generar_plan_30_dias(user_profile)
    return plan

@app.post("/api/reset-plan")
async def reset_plan():
    return {"success": True}

@app.get("/api/check-plan")
async def check_plan(token: str = Depends(oauth2_scheme)):
    user_has_plan = False
    plan_data = {"name": "Plan de ejemplo"} if user_has_plan else None
    return {"hasPlan": user_has_plan, "plan": plan_data}
