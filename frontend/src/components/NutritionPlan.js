import React from 'react';

const NutritionPlan = ({ plan }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Plan</h1>
      <p className="text-gray-600 mb-8">
        Based on your assessment, we've created a personalized plan to help you reach your goals.
      </p>

      {/* Nutrition Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Nutrition</h2>
        <p>{plan.nutrition_plan.calories.toFixed(0)} calories per day</p>
        <p>
          {Math.round((plan.nutrition_plan.carbs / (plan.nutrition_plan.carbs + plan.nutrition_plan.protein + plan.nutrition_plan.fats)) * 100)}%
          carbs, {Math.round((plan.nutrition_plan.protein / (plan.nutrition_plan.carbs + plan.nutrition_plan.protein + plan.nutrition_plan.fats)) * 100)}%
          protein, {Math.round((plan.nutrition_plan.fats / (plan.nutrition_plan.carbs + plan.nutrition_plan.protein + plan.nutrition_plan.fats)) * 100)}% fat
        </p>
      </div>

      {/* Meal Plan Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Meal Plan</h2>
        <div className="flex gap-3 flex-wrap">
          {['Breakfast', 'Morning snack', 'Lunch', 'Afternoon snack', 'Dinner'].map((meal) => (
            <button
              key={meal}
              className="px-4 py-2 bg-gray-200 rounded-full text-gray-800 font-medium"
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

      {/* Workout Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Workouts</h2>
        <p>4 workouts per week</p>
        <div className="flex gap-3 flex-wrap">
          {['Strength', 'Cardio', 'Mobility', 'Recovery'].map((workout) => (
            <button
              key={workout}
              className="px-4 py-2 bg-gray-200 rounded-full text-gray-800 font-medium"
            >
              {workout}
            </button>
          ))}
        </div>
      </div>

      {/* Button to Start Plan */}
      <div className="mt-8">
        <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600">
          Start Day 1
        </button>
      </div>
    </div>
  );
};

export default NutritionPlan;
