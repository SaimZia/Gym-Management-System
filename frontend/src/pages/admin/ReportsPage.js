// src/pages/admin/ReportsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    reportType: 'revenue',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/admin/reports', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      setError('Error fetching reports');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/admin/reports/generate', filters, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      setError('Error generating report');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reports Management</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleGenerateReport}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="startDate" className="sr-only">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={filters.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="sr-only">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={filters.endDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="reportType" className="sr-only">Report Type</label>
              <select
                id="reportType"
                name="reportType"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={filters.reportType}
                onChange={handleInputChange}
              >
                <option value="revenue">Revenue</option>
                <option value="attendance">Attendance</option>
                <option value="membership">Membership</option>
              </select>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Report
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Generated Reports</h3>
          <ul className="mt-4 space-y-4">
            {reports.map(report => (
              <li key={report._id} className="flex items-center justify-between p-4 border rounded-md shadow-sm">
                <div>
                  <h4 className="text-md font-medium text-gray-900">{report.type} Report</h4>
                  <p className="text-sm text-gray-600">Start Date: {report.startDate}</p>
                  <p className="text-sm text-gray-600">End Date: {report.endDate}</p>
                  <p className="text-sm text-gray-600">Generated On: {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    View Report
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;