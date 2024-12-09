// src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { FiUsers, FiDollarSign, FiActivity, FiGrid } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGyms: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/stats/overview', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FiUsers className="text-blue-500" />}
          change="+5% from last month"
        />
        <StatsCard
          title="Total Gyms"
          value={stats.totalGyms}
          icon={<FiGrid className="text-green-500" />}
          change="+2 this month"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<FiDollarSign className="text-yellow-500" />}
          change="+12% from last month"
        />
        <StatsCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={<FiActivity className="text-purple-500" />}
          change="+8% from last month"
        />
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, change }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900 mb-2">{value}</span>
        <span className="text-sm text-green-600">{change}</span>
      </div>
    </div>
  );
}