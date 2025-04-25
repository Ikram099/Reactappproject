import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from "../../features/auth/authActions";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  // State for form inputs and success message
  const [formData, setFormData] = useState({
    user_name: '',
    user_password: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Clear any previous success message
    
    try {
      const result = await dispatch(registerUser(formData));
      
      if (registerUser.fulfilled.match(result)) {
        setSuccessMessage('Registration successful! You can now log in with your credentials.');
        
        // Reset form after successful registration
        setFormData({
          user_name: '',
          user_password: '',
          first_name: '',
          last_name: '',
          email: '',
          mobile_phone: ''
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {/* Show success message if it exists */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Show error message if it exists */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Form fields remain the same as before */}
      <div className="mb-4">
        <label htmlFor="user_name" className="block text-gray-600">
          Username
        </label>
        <input
          type="text"
          id="user_name"
          name="user_name"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value={formData.user_name}
          onChange={handleChange}
          autoComplete="username"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="user_password" className="block text-gray-600">
          Password
        </label>
        <input
          type="password"
          id="user_password"
          name="user_password"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value={formData.user_password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="first_name" className="block text-gray-600">
          First Name
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value={formData.first_name}
          onChange={handleChange}
          autoComplete="given-name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="last_name" className="block text-gray-600">
          Last Name
        </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value={formData.last_name}
          onChange={handleChange}
          autoComplete="family-name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-600">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="mobile_phone" className="block text-gray-600">
          Mobile Phone
        </label>
        <input
          type="tel"
          id="mobile_phone"
          name="mobile_phone"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value={formData.mobile_phone}
          onChange={handleChange}
          autoComplete="tel"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;