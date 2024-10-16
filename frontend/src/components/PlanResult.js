import React from 'react';
import '../styles/PlanResult.css';  // Ruta correcta a la carpeta styles

const PlanResult = ({ plan }) => {
  const { calories, protein, carbs, fats } = plan.nutrition_plan;

  return (
    <div className="plan-result-container">
      <h2 className="plan-title">Tu Plan Personalizado</h2>

      <div className="nutrition-plan">
        <h3 className="section-title">Plan de Nutrición</h3>
        <div className="nutrition-details">
          <p><strong>Calorías:</strong> {calories.toFixed(2)} kcal</p>
          <p><strong>Proteínas:</strong> {protein.toFixed(2)} g</p>
          <p><strong>Carbohidratos:</strong> {carbs.toFixed(2)} g</p>
          <p><strong>Grasas:</strong> {fats.toFixed(2)} g</p>
        </div>
      </div>

      <div className="exercise-plan">
        <h3 className="section-title">Plan de Ejercicio</h3>
        <p>{plan.exercise_plan}</p>
      </div>
    </div>
  );
};

export default PlanResult;








