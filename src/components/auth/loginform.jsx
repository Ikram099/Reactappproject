// LoginForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../features/auth/authActions';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      username: '',
      password: ''
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(userLogin(formData));
      if (response?.payload?.id_token) {
        localStorage.setItem('access_token', `Bearer ${response.payload.id_token}`);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
      <div className="w-full flex flex-col gap-2 mb-4">
        {/* <label className="font-semibold text-xs text-gray-400">Username</label> */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`border rounded-lg px-3 py-2 text-sm w-full outline-none ${
            error ? 'border-red-500' : 'focus:border-blue-500'
          }`}
          placeholder="Username"
          autoComplete="new-username"
          disabled={loading}
        />
      </div>

      <div className="w-full flex flex-col gap-2 mb-5">
        {/* <label className="font-semibold text-xs text-gray-400 dark:text-gray-300">Password</label> */}
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`border rounded-lg px-3 py-2 text-sm w-full outline-none ${
            error ? 'border-red-500' : 'focus:border-blue-500'
          }`}
          placeholder="Password"
          autoComplete="new-password"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm">
          Login failed. Please check your username and password.
        </div>
      )}

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;