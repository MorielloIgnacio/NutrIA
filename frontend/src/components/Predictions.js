// frontend/src/components/Predictions.js
import React from 'react';

const Predictions = ({ predictions }) => {
    return (
        <div>
            <h2>Predicciones de tu Progreso</h2>
            <p>Peso Futuro: {predictions.peso_futuro.toFixed(2)} kg</p>
            <p>Rendimiento Futuro: {predictions.rendimiento_futuro.toFixed(2)}</p>
            <p>Meta Nutricional Futura: {predictions.meta_nutricional_futura.toFixed(2)}</p>
            {/* Puedes agregar gráficos o visualizaciones adicionales aquí */}
                    
        </div>
    );
};

export default Predictions;
