// src/components/customer/DietChecklist.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DietChecklist = () => {
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChecklist();
  }, []);

  const fetchChecklist = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/customer/diet/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setChecklist(response.data.checklist);
      setLoading(false);
    } catch (error) {
      setError('Error fetching diet checklist');
      setLoading(false);
    }
  };

  const handleToggleComplete = async (itemId) => {
    try {
      const updatedChecklist = checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      setChecklist(updatedChecklist);

      await axios.post(`http://localhost:5000/api/v1/customer/diet/${itemId}/progress`, {
        completed: !checklist.find(item => item.id === itemId).completed
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      setError('Error updating checklist item');
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
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Diet Checklist</h2>
        </div>
        <ul className="mt-8 space-y-6">
          {checklist.map(item => (
            <li key={item.id} className="flex items-center justify-between">
              <span className={item.completed ? 'line-through' : ''}>{item.name}</span>
              <button
                onClick={() => handleToggleComplete(item.id)}
                className={`ml-4 px-4 py-2 text-sm font-medium rounded-md ${item.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                {item.completed ? 'Completed' : 'Mark as Complete'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DietChecklist;