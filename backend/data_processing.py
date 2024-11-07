import numpy as np
import pandas as pd
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator # type: ignore

def cargar_datos_usuario(ruta):
    """
    Cargar los datos históricos del usuario desde un archivo CSV.
    """
    user_data = pd.read_csv(ruta)
    return user_data

def generar_secuencias(user_data, target_column, time_steps=2):
    """
    Genera secuencias de datos para la columna de objetivo `target_column`.
    time_steps: número de días anteriores a considerar.
    """
    data = user_data.copy()
    
    # Filtramos solo las columnas numéricas para la normalización
    data = data.select_dtypes(include=[np.number])
    
    # Normalización de datos numéricos
    data = (data - data.mean()) / data.std()  

    # Extraemos la entrada (X) y el objetivo (y)
    X = data.drop(columns=[target_column]).values
    y = data[target_column].values

    generator = TimeseriesGenerator(X, y, length=time_steps, batch_size=32)
    return generator

if __name__ == "__main__":
    ruta = "user_data.csv"
    user_data = cargar_datos_usuario(ruta)
    generator = generar_secuencias(user_data, target_column='peso', time_steps=2)
    print("Secuencias generadas:", len(generator))
    for X, y in generator:
        print("Entrada (X):", X)
        print("Salida (y):", y)
        break
