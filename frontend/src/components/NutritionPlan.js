import React, { useState } from 'react';

const NutritionPlan = ({ plan, onStartDay, onDeletePlan, completedDays = [] }) => {
    // currentDay representa el día actual en el plan, pero vamos a permitir que avances día a día sin restricciones de fecha.
    const currentDayInPlan = completedDays.length + 1;

    if (!plan || !plan.dias) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">No se ha encontrado un plan válido.</h1>
                <button
                    onClick={onDeletePlan}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
                >
                    Eliminar Plan y Crear Nuevo
                </button>
            </div>
        );
    }

    const canStartDay = (day) => {
        // Permitir iniciar solo si el día anterior está completo o si es el primer día
        const previousDayComplete = day === 1 || completedDays.includes(day - 1);
        // Permitir iniciar el día actual sin depender de la fecha
        const dayAvailable = day <= currentDayInPlan;
        return previousDayComplete && dayAvailable;
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Plan de 30 Días</h1>

            {/* Semanas */}
            {Array.from({ length: 4 }, (_, semana) => (
                <div key={semana} className="mb-6">
                    <h2 className="text-lg font-bold mb-4">Semana {semana + 1}</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {plan.dias.slice(semana * 7, (semana + 1) * 7).map((dia) => (
                            <button
                                key={dia.dia}
                                onClick={() => canStartDay(dia.dia) && onStartDay(dia.dia)}
                                className={`flex justify-between items-center px-4 py-3 rounded-lg font-semibold transition-colors ${
                                    completedDays.includes(dia.dia) ? 'bg-green-300 text-white' :
                                    canStartDay(dia.dia) ? 'bg-yellow-400 text-white' :
                                    'bg-gray-200 text-gray-600 cursor-not-allowed'
                                } hover:bg-yellow-300`}
                            >
                                <span>{dia.dia} °Día</span>
                                <span className={`text-sm font-medium ${completedDays.includes(dia.dia) ? 'bg-green-700' : 'bg-gray-400'} px-3 py-1 rounded-full`}>
                                    {completedDays.includes(dia.dia) ? 'Completado' : '0%'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* Botón para eliminar plan */}
            <div className="mt-8 flex justify-center">
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
