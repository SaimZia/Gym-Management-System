// src/pages/management/Dashboard.js
import React, { useState, useEffect } from 'react';
import { FiUsers, FiDollarSign, FiCalendar, FiActivity } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ManagementDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeTrainers: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0
  });
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/management/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setStats(data.stats);
      setRevenueData(data.revenueData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Gym Management Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={<FiUsers />}
          color="blue"
        />
        <StatCard
          title="Active Trainers"
          value={stats.activeTrainers}
          icon={<FiCalendar />}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={<FiDollarSign />}
          color="yellow"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={<FiActivity />}
          color="purple"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4F46E5" />
              <Bar dataKey="expenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="New Member Registration"
              description="John Doe has registered for a new membership"
              time="2 hours ago"
            />
            <ActivityItem
              title="Payment Received"
              description="Payment received for Premium Membership Plan"
              time="3 hours ago"
            />
            <ActivityItem
              title="Trainer Assignment"
              description="Sarah Smith assigned to new member Mike Johnson"
              time="5 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} p-3 rounded-full mr-4`}>
          {React.cloneElement(icon, { className: 'w-6 h-6 text-white' })}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time }) {
  return (
    <div className="flex items-center py-4 border-b last:border-b-0">
      <div className="flex-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}