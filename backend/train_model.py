import pandas as pd
from data_processing import cargar_datos_usuario, generar_secuencias
from lstm_model import crear_modelo_lstm

# Cargar y preparar datos
ruta = "user_data.csv"
user_data = cargar_datos_usuario(ruta)
time_steps = 2  # Cambiado para adaptarse a los datos
n_features = 6  # Ajustado a la cantidad real de características

# Generar secuencias para tres objetivos (ejemplo para 'peso')
generator = generar_secuencias(user_data, target_column='peso', time_steps=time_steps)

# Crear y entrenar el modelo
model = crear_modelo_lstm(time_steps, n_features)
model.fit(generator, epochs=100)

# Guardar el modelo entrenado
model.save("modelo_nutria_lstm.h5")
