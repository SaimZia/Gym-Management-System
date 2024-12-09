// src/components/admin/AccountManagement.js
import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit, FiTrash, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'management',
    contactNumber: '',
    assignedGym: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/admin/accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAccounts(response.data.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAccount) {
        await axios.put(`http://localhost:5000/api/v1/admin/accounts/${selectedAccount._id}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/v1/admin/accounts', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      fetchAccounts();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setFormData({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      password: '',
      role: account.role,
      contactNumber: account.contactNumber,
      assignedGym: account.assignedGym
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (accountId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/admin/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const resetForm = () => {
    setSelectedAccount(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'management',
      contactNumber: '',
      assignedGym: ''
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        <FiUserPlus className="inline mr-2" /> Create Account
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">First Name</th>
            <th className="py-2">Last Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Contact Number</th>
            <th className="py-2">Assigned Gym</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account._id}>
              <td className="py-2">{account.firstName}</td>
              <td className="py-2">{account.lastName}</td>
              <td className="py-2">{account.email}</td>
              <td className="py-2">{account.role}</td>
              <td className="py-2">{account.contactNumber}</td>
              <td className="py-2">{account.assignedGym}</td>
              <td className="py-2">
                <button
                  onClick={() => handleEdit(account)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                >
                  <FiEdit className="inline mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(account._id)}
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
              {selectedAccount ? 'Edit Account' : 'Create Account'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
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
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required={!selectedAccount}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
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
                <label className="block text-sm font-medium text-gray-700">Assigned Gym</label>
                <input
                  type="text"
                  name="assignedGym"
                  value={formData.assignedGym}
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
                  <FiCheck className="inline mr-2" /> {selectedAccount ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;