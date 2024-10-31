import React from 'react';

const NutritionPlan = ({ plan, onStartFirstDay, onDeletePlan }) => {
    if (!plan || !plan.nutrition_plan) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">No se ha encontrado un plan nutricional válido.</h1>
                <button
                    onClick={onDeletePlan}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
                >
                    Eliminar Plan y Crear Nuevo
                </button>
            </div>
        );
    }

    const { calories = 0, carbs = 0, protein = 0, fats = 0 } = plan.nutrition_plan;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Tu Plan</h1>
            <p className="text-gray-600 mb-8">
                Basado en tu evaluación, hemos creado un plan personalizado para ayudarte a alcanzar tus objetivos.
            </p>

            {/* Sección de Nutrición */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Nutrición</h2>
                <p>{calories.toFixed(0)} calorías por día</p>
                <p>
                    {Math.round((carbs / (carbs + protein + fats)) * 100)}% carbohidratos,{' '}
                    {Math.round((protein / (carbs + protein + fats)) * 100)}% proteínas,{' '}
                    {Math.round((fats / (carbs + protein + fats)) * 100)}% grasas
                </p>
            </div>

            {/* Sección de Plan de Comidas */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Plan de Comidas</h2>
                <div className="flex gap-3 flex-wrap">
                    {['Desayuno', 'Merienda de la mañana', 'Almuerzo', 'Merienda de la tarde', 'Cena'].map((meal) => (
                        <button
                            key={meal}
                            className="px-4 py-2 bg-gray-200 rounded-full text-gray-800 font-medium"
                        >
                            {meal}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sección de Entrenamientos */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Entrenamientos</h2>
                <p>4 entrenamientos por semana</p>
                <div className="flex gap-3 flex-wrap">
                    {['Fuerza', 'Cardio', 'Movilidad', 'Recuperación'].map((workout) => (
                        <button
                            key={workout}
                            className="px-4 py-2 bg-gray-200 rounded-full text-gray-800 font-medium"
                        >
                            {workout}
                        </button>
                    ))}
                </div>
            </div>

            {/* Botones para Iniciar Plan y Eliminar Plan */}
            <div className="mt-8 flex gap-4">
                <button
                    onClick={onStartFirstDay}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
                >
                    Iniciar Día 1
                </button>
                <button
                    onClick={onDeletePlan}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
                >
                    Eliminar Plan
                </button>
            </div>
        </div>
    );
};

export default NutritionPlan;
