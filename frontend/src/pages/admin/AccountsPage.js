// src/pages/admin/AccountsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
  });
  const [editingAccountId, setEditingAccountId] = useState(null);

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
      setAccounts(response.data.accounts);
      setLoading(false);
    } catch (error) {
      setError('Error fetching accounts');
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
      if (editingAccountId) {
        await axios.put(`http://localhost:5000/api/v1/admin/accounts/${editingAccountId}`, formData, {
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
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
      });
      setEditingAccountId(null);
    } catch (error) {
      setError('Error saving account');
    }
  };

  const handleEdit = (account) => {
    setFormData(account);
    setEditingAccountId(account._id);
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
      setError('Error deleting account');
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Accounts Management</h2>
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
              <label htmlFor="role" className="sr-only">Role</label>
              <select
                id="role"
                name="role"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingAccountId ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Existing Accounts</h3>
          <ul className="mt-4 space-y-4">
            {accounts.map(account => (
              <li key={account._id} className="flex items-center justify-between p-4 border rounded-md shadow-sm">
                <div>
                  <h4 className="text-md font-medium text-gray-900">{account.firstName} {account.lastName}</h4>
                  <p className="text-sm text-gray-600">Email: {account.email}</p>
                  <p className="text-sm text-gray-600">Role: {account.role}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(account)}
                    className="text-blue-500 hover:text-blue-700 text-sm mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account._id)}
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

export default AccountsPage;