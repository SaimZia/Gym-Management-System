// src/components/admin/ReportGeneration.js
import React, { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiBarChart2, FiPieChart } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import axios from 'axios';

const ReportGeneration = () => {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    gymId: '',
    membershipType: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/admin/reports/generate', {
        reportType,
        dateRange,
        filters
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReportData(response.data.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/reports/download?type=${reportType}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportType}-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters({
        ...filters,
        [parent]: {
          ...filters[parent],
          [child]: value
        }
      });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReportData();
  };

  const renderChart = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'attendance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'membership':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={reportData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {reportData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
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
      <h1 className="text-2xl font-bold mb-4">Report Generation</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        <FiFilter className="inline mr-2" /> Generate Report
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4">Generate Report</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Report Type</label>
                <select
                  name="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="revenue">Revenue</option>
                  <option value="attendance">Attendance</option>
                  <option value="membership">Membership</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Gym ID</label>
                <input
                  type="text"
                  name="gymId"
                  value={filters.gymId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Membership Type</label>
                <input
                  type="text"
                  name="membershipType"
                  value={filters.membershipType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <FiX className="inline mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  <FiDownload className="inline mr-2" /> Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Visualization */}
      {reportData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Report Visualization</h3>
          {renderChart()}

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(reportData.summary || {}).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 uppercase">
                  {key.replace(/_/g, ' ')}
                </h4>
                <p className="mt-1 text-2xl font-semibold">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGeneration;