import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
import joblib

# Paso 1: Generación de datos sintéticos
def generar_datos_sinteticos(n=1000):
    np.random.seed(42)
    data = {
        'weight': np.random.uniform(50, 120, n),  # Peso en kg
        'height': np.random.uniform(150, 200, n),  # Altura en cm
        'age': np.random.randint(18, 65, n),  # Edad entre 18 y 65 años
        'gender': np.random.choice(['male', 'female'], n),
        'activity_level': np.random.choice(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'super_active'], n),
        'body_fat': np.random.uniform(10, 35, n),  # Porcentaje de grasa corporal
        'muscle_mass': np.random.uniform(20, 50, n),  # Masa muscular en kg
        'heart_rate': np.random.uniform(60, 100, n),  # Frecuencia cardíaca en reposo
        'steps': np.random.randint(2000, 15000, n),  # Pasos diarios
        'goals': np.random.choice(['perder_peso', 'ganar_masa_muscular', 'mantener_peso'], n)
    }

    df = pd.DataFrame(data)

    # Calcular TMB usando la fórmula de Mifflin-St Jeor ajustada
    df['tmb'] = df.apply(lambda row: calcular_tmb(row['weight'], row['height'], row['age'], row['gender'], row['body_fat']), axis=1)
    
    # Ajustar TDEE basado en nivel de actividad y pasos
    df['tdee'] = df.apply(lambda row: calcular_tdee(row['tmb'], row['activity_level'], row['steps'], row['heart_rate']), axis=1)

    # Simular un resultado de calorías ajustadas basadas en las metas
    df['calories_adjusted'] = df.apply(lambda row: ajustar_calorias_por_meta(row['tdee'], row['goals']), axis=1)

    # Asignar una rutina de ejercicios (etiqueta para clasificación)
    df['exercise_plan'] = df['activity_level'].apply(asignar_rutina)

    return df

def calcular_tmb(weight, height, age, gender, body_fat=None):
    # Cálculo similar al implementado en el backend
    if body_fat is not None:
        lean_mass = weight * (1 - body_fat / 100)
        return 370 + (21.6 * lean_mass)
    else:
        if gender == 'male':
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        else:
            return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

def calcular_tdee(tmb, activity_level, steps=None, heart_rate=None):
    activity_factors = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'super_active': 1.9
    }
    tdee = tmb * activity_factors[activity_level]
    if steps:
        tdee += steps * 0.04
    if heart_rate:
        tdee += (heart_rate - 60) * 5
    return tdee

def ajustar_calorias_por_meta(tdee, goal):
    if goal == 'perder_peso':
        return tdee - 500  # Déficit calórico
    elif goal == 'ganar_masa_muscular':
        return tdee + 500  # Superávit calórico
    else:
        return tdee  # Mantener peso

def asignar_rutina(activity_level):
    routines = {
        'sedentary': 'Ejercicio en casa',
        'lightly_active': 'Ejercicio en casa',
        'moderately_active': 'Ejercicio al aire libre',
        'very_active': 'Ejercicio en el gimnasio',
        'super_active': 'Entrenamiento avanzado'
    }
    return routines.get(activity_level, 'Ejercicio en casa')

# Generar los datos sintéticos
df = generar_datos_sinteticos()

# Paso 2: Entrenamiento del modelo
# Preprocesamiento
X = df[['weight', 'height', 'age', 'gender', 'activity_level', 'body_fat', 'muscle_mass', 'heart_rate', 'steps']]
y_calories = df['calories_adjusted']
y_exercise = df['exercise_plan']

# Convertir variables categóricas a numéricas
le_gender = LabelEncoder()
le_activity = LabelEncoder()
le_exercise = LabelEncoder()

X.loc[:, 'gender'] = le_gender.fit_transform(X['gender'])
X.loc[:, 'activity_level'] = le_activity.fit_transform(X['activity_level'])
y_exercise = le_exercise.fit_transform(y_exercise)

# Dividir los datos en entrenamiento y prueba
X_train, X_test, y_train_calories, y_test_calories = train_test_split(X, y_calories, test_size=0.2, random_state=42)
X_train_ex, X_test_ex, y_train_exercise, y_test_exercise = train_test_split(X, y_exercise, test_size=0.2, random_state=42)

# Escalar los datos
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Modelo de regresión para calorías
calories_model = LinearRegression()
calories_model.fit(X_train_scaled, y_train_calories)

# Modelo de clasificación para rutina de ejercicio
exercise_model = RandomForestClassifier()
exercise_model.fit(X_train_ex, y_train_exercise)

# Evaluar los modelos (opcional, pero recomendado)
print("Modelo de calorías R^2:", calories_model.score(X_test_scaled, y_test_calories))
print("Modelo de rutina de ejercicios precisión:", exercise_model.score(X_test_ex, y_test_exercise))

# Guardar los modelos y el escalador
joblib.dump(calories_model, 'calories_model.pkl')
joblib.dump(exercise_model, 'exercise_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(le_gender, 'le_gender.pkl')
joblib.dump(le_activity, 'le_activity.pkl')
joblib.dump(le_exercise, 'le_exercise.pkl')
