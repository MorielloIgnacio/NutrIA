import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ setPlan }) => {
  // Estados para todos los campos del formulario
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [trainingPreference, setTrainingPreference] = useState([]);
  const [fitnessGoals, setFitnessGoals] = useState([]);

  const [step, setStep] = useState(0); // Estado para controlar el paso actual del carrusel

  const handleCheckboxChange = (setState, value, state) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar que se haya seleccionado al menos un objetivo de fitness
    if (fitnessGoals.length === 0) {
      alert('Por favor selecciona al menos un objetivo de fitness');
      return;
    }

    // Convertimos routine_preference en una cadena separada por comas
    const formattedRoutinePreference = trainingPreference.length > 0 ? trainingPreference.join(', ') : "Ninguno";

    const userData = {
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      gender,
      activity_level: activityLevel,
      goals: fitnessGoals,
      routine_preference: formattedRoutinePreference, // Ahora es una cadena en lugar de un array
      dietary_restrictions: dietaryRestrictions
    };

    console.log('Enviando datos al backend:', userData);

    try {
      const response = await axios.post('http://localhost:8000/generate_plan/', userData);
      console.log('Respuesta del backend:', response.data);
      setPlan(response.data);
      
    } catch (error) {
      console.error('Error fetching the plan:', error);
    }
  };

  // Funciones para moverse entre pasos del carrusel
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex flex-col items-center min-h-screen bg-white font-['Noto_Sans', 'Work_Sans', sans-serif]">
      <form onSubmit={handleSubmit} className="w-[512px] max-w-full p-8 bg-white rounded-lg shadow-md">

        {/* Renderizado condicional basado en el paso actual */}
        {step === 0 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Datos Personales</h3>
            {/* Peso */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Peso (kg)</span>
                <input
                  type="number"
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418] placeholder:text-[#637588]"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </label>
            </div>
            {/* Altura */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Altura (cm)</span>
                <input
                  type="number"
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418] placeholder:text-[#637588]"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </label>
            </div>
            {/* Edad */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Edad</span>
                <input
                  type="number"
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418] placeholder:text-[#637588]"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Información adicional</h3>
            {/* Género */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Sexo</span>
                <select
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </label>
            </div>
            {/* Nivel de actividad */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Nivel de actividad</span>
                <select
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="sedentary">Sedentario</option>
                  <option value="lightly_active">Ligeramente activo</option>
                  <option value="moderately_active">Moderadamente activo</option>
                  <option value="very_active">Muy activo</option>
                  <option value="super_active">Súper activo</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Preferencias alimenticias</h3>
            {/* Preferencias alimenticias */}
            <div className="flex gap-3 p-3 flex-wrap">
              {['Vegetariano', 'Vegano', 'Sin gluten', 'Sin lactosa', 'Sin nueces', 'Dieta cetogénica'].map((preference) => (
                <div
                  key={preference}
                  onClick={() => handleCheckboxChange(setDietaryRestrictions, preference, dietaryRestrictions)}
                  className={`cursor-pointer flex h-8 items-center justify-center gap-x-2 rounded-xl px-4 ${
                    dietaryRestrictions.includes(preference) ? 'bg-[#1980e6] text-white' : 'bg-[#f0f2f4] text-[#111418]'
                  }`}
                >
                  <p className="text-sm font-medium">{preference}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Tipo de entrenamiento</h3>
            {/* Preferencias de entrenamiento */}
            <div className="flex gap-3 p-3 flex-wrap">
              {['Ejercicio en casa', 'Ejercicio al aire libre', 'Ejercicio en el gimnasio', 'Ninguno', 'No estoy seguro'].map((preference) => (
                <div
                  key={preference}
                  onClick={() => handleCheckboxChange(setTrainingPreference, preference, trainingPreference)}
                  className={`cursor-pointer flex h-8 items-center justify-center gap-x-2 rounded-xl px-4 ${
                    trainingPreference.includes(preference) ? 'bg-[#1980e6] text-white' : 'bg-[#f0f2f4] text-[#111418]'
                  }`}
                >
                  <p className="text-sm font-medium">{preference}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Objetivos de Fitness</h3>
            {/* Objetivos de fitness */}
            <div className="flex gap-3 p-3 flex-wrap">
              {['Perder peso', 'Ganar masa muscular', 'Mejorar la salud', 'Mejorar el rendimiento'].map((goal) => (
                <div
                  key={goal}
                  onClick={() => handleCheckboxChange(setFitnessGoals, goal, fitnessGoals)}
                  className={`cursor-pointer flex h-8 items-center justify-center gap-x-2 rounded-xl px-4 ${
                    fitnessGoals.includes(goal) ? 'bg-[#1980e6] text-white' : 'bg-[#f0f2f4] text-[#111418]'
                  }`}
                >
                  <p className="text-sm font-medium">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button
              type="button"
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={prevStep}
            >
              Anterior
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              onClick={nextStep}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Finalizar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
