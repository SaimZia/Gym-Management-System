// src/components/admin/GymManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit, FiTrash, FiCheck, FiX } from 'react-icons/fi';

const GymManagement = () => {
  const [gyms, setGyms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    contactNumber: '',
    email: '',
    facilities: [],
    workingHours: {
      weekday: {
        open: '',
        close: ''
      },
      weekend: {
        open: '',
        close: ''
      }
    },
    capacity: ''
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/admin/gyms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setGyms(response.data.data);
    } catch (error) {
      console.error('Error fetching gyms:', error);
      setHasError(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedGym) {
        await axios.put(`http://localhost:5000/api/v1/admin/gyms/${selectedGym._id}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/v1/admin/gyms', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      fetchGyms();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving gym:', error);
      setHasError(true);
    }
  };

  const handleEdit = (gym) => {
    setSelectedGym(gym);
    setFormData({
      name: gym.name,
      address: gym.address,
      contactNumber: gym.contactNumber,
      email: gym.email,
      facilities: gym.facilities,
      workingHours: gym.workingHours,
      capacity: gym.capacity
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (gymId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/admin/gyms/${gymId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchGyms();
    } catch (error) {
      console.error('Error deleting gym:', error);
      setHasError(true);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      contactNumber: '',
      email: '',
      facilities: [],
      workingHours: {
        weekday: {
          open: '',
          close: ''
        },
        weekend: {
          open: '',
          close: ''
        }
      },
      capacity: ''
    });
    setSelectedGym(null);
  };

  if (hasError) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setHasError(false)}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gym Management</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        <FiPlus className="inline mr-2" /> Create Gym
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Location</th>
            <th className="py-2">Contact Number</th>
            <th className="py-2">Email</th>
            <th className="py-2">Facilities</th>
            <th className="py-2">Working Hours</th>
            <th className="py-2">Capacity</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gyms.map((gym) => (
            <tr key={gym._id}>
              <td className="py-2">{gym.name}</td>
              <td className="py-2">{`${gym.address.street}, ${gym.address.city}, ${gym.address.state}, ${gym.address.zipCode}, ${gym.address.country}`}</td>
              <td className="py-2">{gym.contactNumber}</td>
              <td className="py-2">{gym.email}</td>
              <td className="py-2">{gym.facilities.join(', ')}</td>
              <td className="py-2">{`Weekday: ${gym.workingHours.weekday.open} - ${gym.workingHours.weekday.close}, Weekend: ${gym.workingHours.weekend.open} - ${gym.workingHours.weekend.close}`}</td>
              <td className="py-2">{gym.capacity}</td>
              <td className="py-2">
                <button
                  onClick={() => handleEdit(gym)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                >
                  <FiEdit className="inline mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(gym._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  <FiTrash className="inline mr-2" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedGym ? 'Edit Gym' : 'Create Gym'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Facilities</label>
                <input
                  type="text"
                  name="facilities"
                  value={formData.facilities.join(', ')}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value.split(', ') })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Weekday Working Hours</label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    name="workingHours.weekday.open"
                    value={formData.workingHours.weekday.open}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <input
                    type="time"
                    name="workingHours.weekday.close"
                    value={formData.workingHours.weekday.close}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Weekend Working Hours</label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    name="workingHours.weekend.open"
                    value={formData.workingHours.weekend.open}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <input
                    type="time"
                    name="workingHours.weekend.close"
                    value={formData.workingHours.weekend.close}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <FiX className="inline mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  <FiCheck className="inline mr-2" /> {selectedGym ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the GymManagement component with ErrorBoundary
const GymManagementWithErrorBoundary = () => (
  <ErrorBoundary>
    <GymManagement />
  </ErrorBoundary>
);

export default GymManagementWithErrorBoundary;