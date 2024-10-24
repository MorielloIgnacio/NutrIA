import React, { useState, useEffect } from 'react';
import '../styles/DayPlan.css'; // Asegúrate de importar el archivo CSS

const DayPlan = ({ dayNumber, onEndDay }) => {
    const [dayData, setDayData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockData = {
            date: "Lunes, 3 de enero",
            meals: [
                { id: 1, name: "Desayuno", time: "8:00am - 9:00am", completed: false, icon: "🍳" },
                { id: 2, name: "Almuerzo", time: "1:00pm - 2:00pm", completed: false, icon: "🍲" },
                { id: 3, name: "Cena", time: "6:00pm - 7:00pm", completed: false, icon: "🍽️" }
            ],
            exercises: [
                { id: 1, name: "Correr 5 millas", time: "5:00am - 6:00am", completed: false, icon: "🏃" },
                { id: 2, name: "Levantar pesas", time: "5:00pm - 6:00pm", completed: false, icon: "🏋️" }
            ]
        };

        setTimeout(() => {
            setDayData(mockData);
            setLoading(false);
        }, 1000);
    }, [dayNumber]);

    const handleToggle = (type, id) => {
        setDayData(prevData => {
            const updatedItems = prevData[type].map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
            );
            return { ...prevData, [type]: updatedItems };
        });
    };

    if (loading) return <p className="text-center">Cargando los datos del día...</p>;

    return (
        <div className="day-plan-container">
            <h1 className="text-2xl font-bold mb-6 text-center">Día {dayNumber}: {dayData.date}</h1>
            <section className="section">
                <h2 className="section-title">Comidas</h2>
                <div className="items-container">
                    {dayData.meals.map(meal => (
                        <div key={meal.id} className="item">
                            <span className="item-icon">{meal.icon}</span>
                            <div className="item-details">
                                <p className="item-name">{meal.name}</p>
                                <p className="item-time">{meal.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="section">
                <h2 className="section-title">Ejercicios</h2>
                <div className="items-container">
                    {dayData.exercises.map(exercise => (
                        <div key={exercise.id} className="item">
                            <span className="item-icon">{exercise.icon}</span>
                            <div className="item-details">
                                <p className="item-name">{exercise.name}</p>
                                <p className="item-time">{exercise.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="section">
                <h2 className="section-title">Feedback</h2>
                <div className="items-container">
                    {dayData.meals.map(meal => (
                        <div key={meal.id} className="feedback-item">
                            <p className="feedback-name">{meal.name}</p>
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
                    {dayData.exercises.map(exercise => (
                        <div key={exercise.id} className="feedback-item">
                            <p className="feedback-name">{exercise.name}</p>
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
            <div className="buttons-container">
                <button 
                    onClick={onEndDay} 
                    className="button button-secondary"
                >
                    Terminar plan
                </button>
                <button 
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
                    >
                    Guardar cambios
                </button>
            </div>
        </div>
    );
};

export default DayPlan;
