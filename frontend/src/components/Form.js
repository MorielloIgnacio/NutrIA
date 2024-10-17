import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ setPlan }) => {
  // Estados para todos los campos del formulario básico
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [dislikedFoods, setDislikedFoods] = useState(''); // Alimentos que no le gustan
  const [trainingPreference, setTrainingPreference] = useState([]);
  const [fitnessGoals, setFitnessGoals] = useState([]);

  // Estados para datos avanzados y dispositivos inteligentes
  const [advanced, setAdvanced] = useState(false);
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [steps, setSteps] = useState('');
  const [smartDevice, setSmartDevice] = useState(false); // Sincronización con dispositivos

  const [step, setStep] = useState(0);

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

    const formattedRoutinePreference = trainingPreference.length > 0 ? trainingPreference.join(', ') : "Ninguno";

    // Datos del usuario básico + avanzado si se activó + dispositivos si se seleccionó
    const userData = {
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      gender,
      activity_level: activityLevel,
      goals: fitnessGoals,
      routine_preference: formattedRoutinePreference,
      dietary_restrictions: dietaryRestrictions,
      disliked_foods: dislikedFoods, // Incluye alimentos que no le gustan
      ...(advanced && {
        body_fat: parseFloat(bodyFat),
        muscle_mass: parseFloat(muscleMass),
      }),
      ...(smartDevice && {
        heart_rate: parseFloat(heartRate),
        steps: parseInt(steps),
      })
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

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 5));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

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

        {/* Sección avanzada */}
        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Datos avanzados y dispositivos</h3>
            <label className="block pb-2">
              <input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} />
              <span className="ml-2">Proveer datos avanzados</span>
            </label>

            {advanced && (
              <div>
                {/* Porcentaje de grasa corporal */}
                <div className="px-4 py-3">
                  <label className="block pb-2">
                    <span className="text-base font-medium text-[#111418]">Porcentaje de grasa corporal (%)</span>
                    <input
                      type="number"
                      className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418] placeholder:text-[#637588]"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                    />
                  </label>
                </div>
                {/* Masa muscular */}
                <div className="px-4 py-3">
                  <label className="block pb-2">
                    <span className="text-base font-medium text-[#111418]">Masa muscular (kg)</span>
                    <input
                      type="number"
                      className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418] placeholder:text-[#637588]"
                      value={muscleMass}
                      onChange={(e) => setMuscleMass(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Sincronización con dispositivos inteligentes */}
            <label className="block mt-4">
              <input
                type="checkbox"
                checked={smartDevice}
                onChange={(e) => setSmartDevice(e.target.checked)}
              />
              <span className="ml-2">Sincronizar con un dispositivo inteligente</span>
            </label>

            {smartDevice && (
              <div className="mt-4">
                {/* Frecuencia cardíaca */}
                <div className="px-4 py-3">
                  <label className="block pb-2">
                    <span className="text-base font-medium text-[#111418]">Frecuencia cardíaca en reposo (BPM)</span>
                    <input
                      type="number"
                      className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418] placeholder:text-[#637588]"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                    />
                  </label>
                </div>
                {/* Pasos diarios */}
                <div className="px-4 py-3">
                  <label className="block pb-2">
                    <span className="text-base font-medium text-[#111418]">Pasos diarios</span>
                    <input
                      type="number"
                      className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418] placeholder:text-[#637588]"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preferencias alimenticias */}
        {step === 3 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Preferencias alimenticias</h3>
            <div className="flex gap-3 p-3 flex-wrap">
              {['Sin restricciones', 'Vegetariano', 'Vegano', 'Sin gluten', 'Sin lactosa', 'Sin nueces', 'Dieta cetogénica'].map((preference) => (
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
            {/* Alimentos que no le gustan */}
            <div className="px-4 py-3 mt-4">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Alimentos que prefieres evitar</span>
                <input
                  type="text"
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418] placeholder:text-[#637588]"
                  placeholder="Ej. Brócoli, pescado"
                  value={dislikedFoods}
                  onChange={(e) => setDislikedFoods(e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Tipo de entrenamiento */}
        {step === 4 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Tipo de entrenamiento</h3>
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

        {/* Objetivos de Fitness */}
        {step === 5 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Objetivos de Fitness</h3>
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
          {step < 5 ? (
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
