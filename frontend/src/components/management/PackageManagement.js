// src/components/management/PackageManagement.js
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';

export default function PackageManagement() {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: {
      value: '',
      unit: 'months'
    },
    price: {
      amount: '',
      currency: 'USD'
    },
    features: [],
    maxMembers: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/management/packages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedPackage 
        ? `http://localhost:5000/api/v1/management/packages/${selectedPackage._id}`
        : 'http://localhost:5000/api/v1/management/packages';
      
      const method = selectedPackage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPackages();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/management/packages/${packageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          fetchPackages();
        }
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: {
        value: '',
        unit: 'months'
      },
      price: {
        amount: '',
        currency: 'USD'
      },
      features: [],
      maxMembers: ''
    });
    setSelectedPackage(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Package Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" /> Add New Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-indigo-500 p-4">
              <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
              <p className="text-indigo-100 mt-1">{pkg.duration.value} {pkg.duration.unit}</p>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold text-gray-900 mb-4">
                ${pkg.price.amount} <span className="text-sm text-gray-500">/{pkg.duration.unit}</span>
              </div>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <FiPackage className="mr-2 text-indigo-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setFormData(pkg);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {selectedPackage ? 'Edit Package' : 'Add New Package'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Package Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Duration Value
                    </label>
                    <input
                      type="number"
                      value={formData.duration.value}
                      onChange={(e) => setFormData({
                        ...formData,
                        duration: { ...formData.duration, value: e.target.value }
                      })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Duration Unit
                    </label>
                    <select
                      value={formData.duration.unit}
                      onChange={(e) => setFormData({
                        ...formData,
                        duration: { ...formData.duration, unit: e.target.value }
                      })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price.amount}
                    onChange={(e) => setFormData({
                      ...formData,
                      price: { ...formData.price, amount: e.target.value }
                    })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Features
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="ml-2 text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    + Add Feature
                  </button>
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                    {selectedPackage ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}