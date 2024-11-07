import React, { useState, useEffect } from 'react';
import '../styles/DayPlan.css';

const DayPlan = ({ dayNumber, plan, onEndDay, onCompleteDay }) => {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (plan && plan.dias) {
      const selectedDayData = plan.dias.find(dia => dia.dia === dayNumber);

      // Intentamos recuperar el estado guardado de localStorage
      const savedDayData = JSON.parse(localStorage.getItem(`dayData_${dayNumber}`));

      if (selectedDayData) {
        const dayData = {
          date: `Día ${dayNumber}`,
          meals: selectedDayData.recetas.map((receta, index) => ({
            id: index + 1,
            name: receta.Recipe_name,
            completed: savedDayData?.meals[index]?.completed || false, // Recuperamos el estado guardado si existe
            icon: '🍽️',
            details: receta,
          })),
          exercises: selectedDayData.ejercicios.map((ejercicio, index) => ({
            id: index + 1,
            name: ejercicio.name,
            completed: savedDayData?.exercises[index]?.completed || false, // Recuperamos el estado guardado si existe
            icon: '🏋️',
            details: ejercicio,
          })),
        };
        setDayData(dayData);
      }
      setLoading(false);
    }
  }, [plan, dayNumber]);

  const handleToggle = (type, id) => {
    setDayData(prevData => {
      const updatedItems = prevData[type].map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      const updatedDayData = { ...prevData, [type]: updatedItems };

      // Guardamos el estado actualizado en localStorage
      localStorage.setItem(`dayData_${dayNumber}`, JSON.stringify(updatedDayData));
      
      return updatedDayData;
    });
  };

  const isDayComplete = () => {
    return dayData.meals.every(meal => meal.completed) &&
           dayData.exercises.every(exercise => exercise.completed);
  };

  const onSaveChanges = () => {
    if (isDayComplete()) {
      onCompleteDay(dayNumber); // Marca el día como completo
    } else {
      alert('Debes completar todas las comidas y ejercicios antes de guardar.');
    }
  };

  if (loading || !dayData) return <p className="text-center">Cargando los datos del día...</p>;

  return (
    <div className="day-plan-container">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Día {dayNumber}: {dayData.date}
      </h1>
      
      {/* Sección de Comidas */}
      <section className="section">
        <h2 className="section-title">Comidas</h2>
        <div className="items-container">
          {dayData.meals.map(meal => (
            <div key={meal.id} className="item">
              <span className="item-icon">{meal.icon}</span>
              <div className="item-details">
                <p className="item-name">{meal.name}</p>
                <p>Calorías: {meal.details.Calories.toFixed(0)} kcal</p>
                <p>Proteínas: {meal.details['Protein(g)']}g</p>
                <p>Carbohidratos: {meal.details['Carbs(g)']}g</p>
                <p>Grasas: {meal.details['Fat(g)']}g</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={meal.completed}
                  onChange={() => handleToggle('meals', meal.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Ejercicios */}
      <section className="section">
        <h2 className="section-title">Ejercicios</h2>
        <div className="items-container">
          {dayData.exercises.map(exercise => (
            <div key={exercise.id} className="item">
              <span className="item-icon">{exercise.icon}</span>
              <div className="item-details">
                <p className="item-name">{exercise.name}</p>
                <p>Parte del Cuerpo: {exercise.details.bodyPart}</p>
                <p>Objetivo Muscular: {exercise.details.target}</p>
                <p>Equipamiento: {exercise.details.equipment}</p>
                <p>Intensidad: {exercise.details.Intensity}</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={exercise.completed}
                  onChange={() => handleToggle('exercises', exercise.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Botones */}
      <div className="buttons-container">
        <button onClick={onEndDay} className="button button-secondary">
          Terminar plan
        </button>
        <button onClick={onSaveChanges} className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600">
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default DayPlan;
