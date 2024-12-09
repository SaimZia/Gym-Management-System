// src/components/customer/Subscription.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Subscription = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/customer/subscription/packages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPackages(response.data.packages);
      setLoading(false);
    } catch (error) {
      setError('Error fetching subscription packages');
      setLoading(false);
    }
  };

  const handleSubscribe = async (packageId) => {
    try {
      await axios.post('http://localhost:5000/api/v1/customer/subscription/subscribe', { packageId }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedPackage(packageId);
    } catch (error) {
      setError('Error subscribing to package');
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Subscription Packages</h2>
        </div>
        <ul className="mt-8 space-y-6">
          {packages.map(pkg => (
            <li key={pkg._id} className="flex items-center justify-between p-4 border rounded-md shadow-sm">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-600">{pkg.description}</p>
                <p className="text-sm text-gray-600">Duration: {pkg.duration.value} {pkg.duration.unit}</p>
                <p className="text-sm text-gray-600">Price: ${pkg.price.amount} {pkg.price.currency}</p>
                <p className="text-sm text-gray-600">Features: {pkg.features.join(', ')}</p>
              </div>
              <button
                onClick={() => handleSubscribe(pkg._id)}
                className={`ml-4 px-4 py-2 text-sm font-medium rounded-md ${selectedPackage === pkg._id ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                disabled={selectedPackage === pkg._id}
              >
                {selectedPackage === pkg._id ? 'Subscribed' : 'Subscribe'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Subscription;