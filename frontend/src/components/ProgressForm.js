import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressForm = ({ onProgressSubmit, dayNumber, onClose }) => {
    const [dailyData, setDailyData] = useState({
        weight: '',
        hoursSleep: '',
        energyLevel: '',
    });

    useEffect(() => {
        const savedDayData = JSON.parse(localStorage.getItem(`dayData_${dayNumber}`));

        if (savedDayData) {
            const totalCaloriesConsumed = savedDayData.meals
                .filter(meal => meal.completed)
                .reduce((sum, meal) => sum + (meal.details.Calories || 0), 0);

            const totalCaloriesBurned = savedDayData.exercises
                .filter(exercise => exercise.completed)
                .reduce((sum, exercise) => sum + (exercise.details.Calories_Burned || 0), 0);

            setDailyData(prevData => ({
                ...prevData,
                caloriesConsumed: totalCaloriesConsumed,
                caloriesBurned: totalCaloriesBurned,
            }));
        }
    }, [dayNumber]);

    const handleChange = (e) => {
        setDailyData({
            ...dailyData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:8000/update_plan', dailyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            onProgressSubmit(response.data);
            onClose(); // Cierra el popup después del envío exitoso
        } catch (error) {
            console.error('Error al actualizar el plan con los datos de progreso:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Registrar Progreso Semanal</h2>
            <label className="block mb-2">
                Peso (kg)
                <input
                    type="number"
                    name="weight"
                    placeholder="Peso (kg)"
                    value={dailyData.weight}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </label>
            <label className="block mb-2">
                Horas de Sueño
                <input
                    type="number"
                    name="hoursSleep"
                    placeholder="Horas de sueño"
                    value={dailyData.hoursSleep}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </label>
            <label className="block mb-2">
                Nivel de Energía (1-10)
                <input
                    type="number"
                    name="energyLevel"
                    placeholder="Nivel de energía"
                    value={dailyData.energyLevel}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
            </label>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md mt-4">
                Guardar Progreso
            </button>
        </form>
    );
};

export default ProgressForm;
