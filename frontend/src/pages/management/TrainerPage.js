// src/pages/management/TrainerPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
  });
  const [editingTrainerId, setEditingTrainerId] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/management/trainers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTrainers(response.data.trainers);
      setLoading(false);
    } catch (error) {
      setError('Error fetching trainers');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrainerId) {
        await axios.put(`http://localhost:5000/api/v1/management/trainers/${editingTrainerId}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/v1/management/trainers', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      fetchTrainers();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        specialization: '',
      });
      setEditingTrainerId(null);
    } catch (error) {
      setError('Error saving trainer');
    }
  };

  const handleEdit = (trainer) => {
    setFormData(trainer);
    setEditingTrainerId(trainer._id);
  };

  const handleDelete = async (trainerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/management/trainers/${trainerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTrainers();
    } catch (error) {
      setError('Error deleting trainer');
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Trainer Management</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="specialization" className="sr-only">Specialization</label>
              <input
                id="specialization"
                name="specialization"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingTrainerId ? 'Update Trainer' : 'Create Trainer'}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Existing Trainers</h3>
          <ul className="mt-4 space-y-4">
            {trainers.map(trainer => (
              <li key={trainer._id} className="flex items-center justify-between p-4 border rounded-md shadow-sm">
                <div>
                  <h4 className="text-md font-medium text-gray-900">{trainer.firstName} {trainer.lastName}</h4>
                  <p className="text-sm text-gray-600">Email: {trainer.email}</p>
                  <p className="text-sm text-gray-600">Specialization: {trainer.specialization}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(trainer)}
                    className="text-blue-500 hover:text-blue-700 text-sm mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trainer._id)}
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

export default TrainerPage;