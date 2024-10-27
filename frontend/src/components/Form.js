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
  const [dislikedFoods, setDislikedFoods] = useState('');
  const [trainingPreference, setTrainingPreference] = useState([]);
  const [fitnessGoals, setFitnessGoals] = useState([]);

  // Estados para datos avanzados y dispositivos inteligentes
  const [advanced, setAdvanced] = useState(false);
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [steps, setSteps] = useState('');
  const [smartDevice, setSmartDevice] = useState(false);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({}); // Estado de errores

  const validateForm = () => {
    const newErrors = {};
  
    // Validación para el peso
    if (!weight || isNaN(weight) || weight < 20 || weight > 500) {
      newErrors.weight = 'El peso debe estar entre 20 kg y 500 kg';
    }
  
    // Validación para la altura
    if (!height || isNaN(height) || height < 50 || height > 300) {
      newErrors.height = 'La altura debe estar entre 50 cm y 300 cm';
    }
  
    // Validación para la edad
    if (!age || isNaN(age) || age < 10 || age > 120) {
      newErrors.age = 'La edad debe estar entre 10 y 120 años';
    }
  
    // Validación para el género
    if (!gender) {
      newErrors.gender = 'Selecciona un género';
    }
  
    // Validación para el nivel de actividad
    if (!activityLevel) {
      newErrors.activityLevel = 'Selecciona un nivel de actividad';
    }
  
    // Validación para los objetivos de fitness
    if (fitnessGoals.length === 0) {
      newErrors.fitnessGoals = 'Selecciona al menos un objetivo de fitness';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const userData = {
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age),
        gender,
        activity_level: activityLevel,
        goals: fitnessGoals,
        routine_preference: trainingPreference.join(', ') || 'Ninguno',
        dietary_restrictions: dietaryRestrictions,
        disliked_foods: dislikedFoods,
        ...(advanced && { body_fat: parseFloat(bodyFat), muscle_mass: parseFloat(muscleMass) }),
        ...(smartDevice && { heart_rate: parseFloat(heartRate), steps: parseInt(steps) })
      };

      try {
        const response = await axios.post('http://localhost:8000/generate_plan/', userData);
        setPlan(response.data);
      } catch (error) {
        console.error('Error al obtener el plan:', error);
      }
    }
  };

  const handleCheckboxChange = (setState, value, state) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 5));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  return (
    <div className="flex flex-col items-center min-h-screen bg-white font-['Noto_Sans', 'Work_Sans', sans-serif]">
      <form onSubmit={handleSubmit} className="w-[512px] max-w-full p-8 bg-white rounded-lg shadow-md">

        {/* Paso 0: Datos Personales */}
        {step === 0 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Datos Personales</h3>
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
                {errors.weight && <p style={{ color: 'red' }}>{errors.weight}</p>}
              </label>
            </div>
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
                {errors.height && <p style={{ color: 'red' }}>{errors.height}</p>}
              </label>
            </div>
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
                {errors.age && <p style={{ color: 'red' }}>{errors.age}</p>}
              </label>
            </div>
          </div>
        )}

        {/* Paso 1: Información adicional */}
        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Información adicional</h3>
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
                {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
              </label>
            </div>
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
                {errors.activityLevel && <p style={{ color: 'red' }}>{errors.activityLevel}</p>}
              </label>
            </div>
          </div>
        )}

        {/* Paso 2: Datos avanzados y dispositivos */}
        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Datos avanzados y dispositivos</h3>
            <label className="block pb-2">
              <input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} />
              <span className="ml-2">Proveer datos avanzados</span>
            </label>

            {advanced && (
              <div>
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

        {/* Paso 3: Preferencias alimenticias */}
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

        {/* Paso 4: Tipo de entrenamiento */}
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

        {/* Paso 5: Objetivos de Fitness */}
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
