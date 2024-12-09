// src/pages/admin/GymManagement.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGyms, addGym, updateGym, deleteGym, clearError } from '../../redux/slices/gymSlice';

const GymManagement = () => {
  const dispatch = useDispatch();
  const { gyms, loading, error } = useSelector((state) => state.gyms);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
  });
  const [editingGymId, setEditingGymId] = useState(null);

  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (editingGymId) {
      dispatch(updateGym({ id: editingGymId, gymData: formData }));
    } else {
      dispatch(addGym(formData));
    }
    setFormData({
      name: '',
      address: '',
      contactNumber: '',
      email: '',
    });
    setEditingGymId(null);
  };

  const handleEdit = (gym) => {
    setFormData(gym);
    setEditingGymId(gym._id);
  };

  const handleDelete = (gymId) => {
    dispatch(deleteGym(gymId));
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Gym Management</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="sr-only">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="sr-only">Contact Number</label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contact Number"
                value={formData.contactNumber}
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={formData.email}
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
              {editingGymId ? 'Update Gym' : 'Create Gym'}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Existing Gyms</h3>
          <ul className="mt-4 space-y-4">
            {gyms.map(gym => (
              <li key={gym._id} className="flex items-center justify-between p-4 border rounded-md shadow-sm">
                <div>
                  <h4 className="text-md font-medium text-gray-900">{gym.name}</h4>
                  <p className="text-sm text-gray-600">Address: {gym.address}</p>
                  <p className="text-sm text-gray-600">Contact Number: {gym.contactNumber}</p>
                  <p className="text-sm text-gray-600">Email: {gym.email}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(gym)}
                    className="text-blue-500 hover:text-blue-700 text-sm mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gym._id)}
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

export default GymManagement;