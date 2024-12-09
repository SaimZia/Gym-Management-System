// src/pages/customer/PaymentPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'card',
    description: ''
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/customer/payments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPayments(response.data.payments);
      setLoading(false);
    } catch (error) {
      setError('Error fetching payment history');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/v1/customer/payments', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPayments();
      setFormData({
        amount: '',
        paymentMethod: 'card',
        description: ''
      });
    } catch (error) {
      setError('Error making payment');
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Payment History</h2>
        </div>
        <ul className="mt-8 space-y-6">
          {payments.map(payment => (
            <li key={payment._id} className="flex items-center justify-between p-4 border rounded-md shadow-sm">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Amount: ${payment.amount}</h3>
                <p className="text-sm text-gray-600">Method: {payment.paymentMethod}</p>
                <p className="text-sm text-gray-600">Description: {payment.description}</p>
                <p className="text-sm text-gray-600">Date: {new Date(payment.date).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
        <div>
          <h3 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Make a Payment</h3>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="amount" className="sr-only">Amount</label>
              <input
                id="amount"
                name="amount"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="paymentMethod" className="sr-only">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="sr-only">Description</label>
              <input
                id="description"
                name="description"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Make Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;