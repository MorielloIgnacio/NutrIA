# backend/train_model.py
import pandas as pd

# Cargar el dataset desde la ruta donde lo guardaste
data = pd.read_csv('data/nutrition_exercise_data.csv')
# backend/train_model.py
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import joblib
from sklearn.preprocessing import LabelEncoder

# Codificar la variable Gender
le = LabelEncoder()
data['Gender'] = le.fit_transform(data['Gender'])  # Convierte 'Male' en 0 y 'Female' en 1

# Incluir Gender en el conjunto de características
X = data[['Actual Weight', 'Age', 'Duration', 'Exercise Intensity', 'BMI', 'Heart Rate', 'Gender']]


# Usar 'Calories Burn' como la variable objetivo
y = data['Calories Burn']

# Dividir los datos en entrenamiento (80%) y prueba (20%)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Escalar los datos (normalizar)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Crear el modelo de regresión lineal
model = LinearRegression()

# Entrenar el modelo con los datos de entrenamiento
model.fit(X_train_scaled, y_train)

# Hacer predicciones en el conjunto de prueba
y_pred = model.predict(X_test_scaled)

# Evaluar el modelo usando el error cuadrático medio (MSE)
mse = mean_squared_error(y_test, y_pred)
print(f'Error cuadrático medio: {mse}')

# Guardar el modelo entrenado
joblib.dump(model, 'calories_model.pkl')

# Guardar también el escalador para usarlo en FastAPI
joblib.dump(scaler, 'scaler.pkl')
