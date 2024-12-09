// src/components/common/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, validateRequired, validatePhoneNumber } from '../../utils/validation';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    role: 'customer'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!validatePhoneNumber(formData.contactNumber)) {
      newErrors.contactNumber = 'Invalid phone number';
    }
    if (!validateRequired(formData.firstName)) {
      newErrors.firstName = 'First name is required';
    }
    if (!validateRequired(formData.lastName)) {
      newErrors.lastName = 'Last name is required';
    }
    if (!validateRequired(formData.address.street)) {
      newErrors.street = 'Street is required';
    }
    if (!validateRequired(formData.address.city)) {
      newErrors.city = 'City is required';
    }
    if (!validateRequired(formData.address.state)) {
      newErrors.state = 'State is required';
    }
    if (!validateRequired(formData.address.zipCode)) {
      newErrors.zipCode = 'Zip code is required';
    }
    if (!validateRequired(formData.address.country)) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/customer/account/register', formData);
        if (response.data.success) {
          navigate('/login');
        }
      } catch (error) {
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for an account</h2>
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
                onChange={handleChange}
              />
              {errors.firstName && <div className="text-red-500 text-sm mt-2">{errors.firstName}</div>}
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
                onChange={handleChange}
              />
              {errors.lastName && <div className="text-red-500 text-sm mt-2">{errors.lastName}</div>}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="text-red-500 text-sm mt-2">{errors.email}</div>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="text-red-500 text-sm mt-2">{errors.password}</div>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <div className="text-red-500 text-sm mt-2">{errors.confirmPassword}</div>}
            </div>
            <div>
              <label htmlFor="contactNumber" className="sr-only">Contact Number</label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
              />
              {errors.contactNumber && <div className="text-red-500 text-sm mt-2">{errors.contactNumber}</div>}
            </div>
            <div>
              <label htmlFor="address.street" className="sr-only">Street</label>
              <input
                id="address.street"
                name="address.street"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Street"
                value={formData.address.street}
                onChange={handleChange}
              />
              {errors.street && <div className="text-red-500 text-sm mt-2">{errors.street}</div>}
            </div>
            <div>
              <label htmlFor="address.city" className="sr-only">City</label>
              <input
                id="address.city"
                name="address.city"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="City"
                value={formData.address.city}
                onChange={handleChange}
              />
              {errors.city && <div className="text-red-500 text-sm mt-2">{errors.city}</div>}
            </div>
            <div>
              <label htmlFor="address.state" className="sr-only">State</label>
              <input
                id="address.state"
                name="address.state"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="State"
                value={formData.address.state}
                onChange={handleChange}
              />
              {errors.state && <div className="text-red-500 text-sm mt-2">{errors.state}</div>}
            </div>
            <div>
              <label htmlFor="address.zipCode" className="sr-only">Zip Code</label>
              <input
                id="address.zipCode"
                name="address.zipCode"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Zip Code"
                value={formData.address.zipCode}
                onChange={handleChange}
              />
              {errors.zipCode && <div className="text-red-500 text-sm mt-2">{errors.zipCode}</div>}
            </div>
            <div>
              <label htmlFor="address.country" className="sr-only">Country</label>
              <input
                id="address.country"
                name="address.country"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Country"
                value={formData.address.country}
                onChange={handleChange}
              />
              {errors.country && <div className="text-red-500 text-sm mt-2">{errors.country}</div>}
            </div>
          </div>

          {errors.form && <div className="text-red-500 text-sm mt-2">{errors.form}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;