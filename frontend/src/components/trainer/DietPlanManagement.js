// src/components/trainer/DietPlanManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DietPlanManagement = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    planName: '',
    startDate: '',
    endDate: '',
    dailyCalories: '',
    meals: []
  });
  const [editingPlanId, setEditingPlanId] = useState(null);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/trainer/diet', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDietPlans(response.data.dietPlans);
      setLoading(false);
    } catch (error) {
      setError('Error fetching diet plans');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMealChange = (index, value) => {
    const newMeals = [...formData.meals];
    newMeals[index] = value;
    setFormData({ ...formData, meals: newMeals });
  };

  const handleAddMeal = () => {
    setFormData({ ...formData, meals: [...formData.meals, ''] });
  };

  const handleRemoveMeal = (index) => {
    const newMeals = formData.meals.filter((_, i) => i !== index);
    setFormData({ ...formData, meals: newMeals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlanId) {
        await axios.put(`http://localhost:5000/api/v1/trainer/diet/${editingPlanId}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/v1/trainer/diet', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      fetchDietPlans();
      setFormData({
        planName: '',
        startDate: '',
        endDate: '',
        dailyCalories: '',
        meals: []
      });
      setEditingPlanId(null);
    } catch (error) {
      setError('Error saving diet plan');
    }
  };

  const handleEdit = (plan) => {
    setFormData(plan);
    setEditingPlanId(plan._id);
  };

  const handleDelete = async (planId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/trainer/diet/${planId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchDietPlans();
    } catch (error) {
      setError('Error deleting diet plan');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Diet Plan Management</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="planName" className="sr-only">Plan Name</label>
              <input
                id="planName"
                name="planName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Plan Name"
                value={formData.planName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="startDate" className="sr-only">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="sr-only">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="dailyCalories" className="sr-only">Daily Calories</label>
              <input
                id="dailyCalories"
                name="dailyCalories"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Daily Calories"
                value={formData.dailyCalories}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Meals</label>
              {formData.meals.map((meal, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={meal}
                    onChange={(e) => handleMealChange(index, e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMeal(index)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMeal}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Meal
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingPlanId ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Existing Diet Plans</h3>
          <ul className="mt-4 space-y-4">
            {dietPlans.map(plan => (
              <li key={plan._id} className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-gray-900">{plan.planName}</h4>
                  <p className="text-sm text-gray-600">Start Date: {plan.startDate}</p>
                  <p className="text-sm text-gray-600">End Date: {plan.endDate}</p>
                  <p className="text-sm text-gray-600">Daily Calories: {plan.dailyCalories}</p>
                  <p className="text-sm text-gray-600">Meals: {plan.meals.join(', ')}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(plan)}
                    className="text-blue-500 hover:text-blue-700 text-sm mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DietPlanManagement;