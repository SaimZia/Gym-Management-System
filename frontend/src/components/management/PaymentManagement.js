// src/components/management/PaymentManagement.js
import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiDownload, FiFilter, FiCalendar } from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    successfulPayments: 0,
    failedPayments: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });

      const response = await fetch(
        `http://localhost:5000/api/v1/management/payments?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      const data = await response.json();
      setPayments(data.payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/v1/management/payments/stats',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const handleProcessPayment = async (formData) => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/v1/management/payments/process',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        fetchPayments();
        fetchStats();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const exportPayments = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/v1/management/payments/export',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payments_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting payments:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiDollarSign className="mr-2" /> Process Payment
          </button>
          <button
            onClick={exportPayments}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiDownload className="mr-2" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<FiDollarSign className="text-green-500" />}
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={<FiCalendar className="text-yellow-500" />}
        />
        <StatCard
          title="Successful Payments"
          value={stats.successfulPayments}
          icon={<FiDollarSign className="text-blue-500" />}
        />
        <StatCard
          title="Failed Payments"
          value={stats.failedPayments}
          icon={<FiDollarSign className="text-red-500" />}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="subscription">Subscription</option>
              <option value="trainer">Trainer Payment</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <button
          onClick={fetchPayments}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiFilter className="mr-2" /> Apply Filters
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map(payment => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 capitalize">{payment.type}</td>
                <td className="px-6 py-4">${payment.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4">{payment.user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Process Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          {/* Modal implementation */}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}