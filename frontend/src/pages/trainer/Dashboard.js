// src/pages/customer/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState({
    totalMembers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    upcomingClasses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/customer/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Total Members</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{data.totalMembers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Active Subscriptions</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{data.activeSubscriptions}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">${data.totalRevenue}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Classes</h3>
            <ul className="mt-2 space-y-2">
              {data.upcomingClasses.map((classItem, index) => (
                <li key={index} className="text-sm text-gray-700">{classItem}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
          <div className="mt-4 space-x-4">
            <Link to="/diet-checklist" className="text-indigo-600 hover:text-indigo-800">Diet Checklist</Link>
            <Link to="/diet-plan-management" className="text-indigo-600 hover:text-indigo-800">Diet Plan Management</Link>
            <Link to="/subscription" className="text-indigo-600 hover:text-indigo-800">Subscription</Link>
            <Link to="/accounts" className="text-indigo-600 hover:text-indigo-800">Accounts</Link>
            <Link to="/reports" className="text-indigo-600 hover:text-indigo-800">Reports</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;