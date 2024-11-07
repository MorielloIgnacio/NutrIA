import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

def crear_modelo_lstm(time_steps, n_features):
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(time_steps, n_features)),
        Dropout(0.3),
        LSTM(32, return_sequences=False),
        Dropout(0.3),
        Dense(3)  # Tres neuronas de salida para los tres objetivos
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

if __name__ == "__main__":
    time_steps = 7
    n_features = 8  # Supón que tenemos 8 características en la entrada

    modelo = crear_modelo_lstm(time_steps, n_features)
    modelo.summary()
