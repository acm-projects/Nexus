import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { motion } from 'framer-motion';
import axios from 'axios'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('');

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', { email, password })
    console.log('Server response:', response.data)

    if (response.data.token) {
      setToken(response.data.token)
      setMessage('Login successful')
      console.log('Login successful, redirecting...')
      navigate('/');
    } else {
      setMessage('Login failed: No token received')
      console.log('Login failed: No token received')
    }

  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message
    setMessage(`Login failed: ${errorMessage}`)
    console.error('Login error:', errorMessage)
  }
}

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-t from-nexus-blue-700 to-nexus-blue-900 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md w-96 bg-gradient-to-b from-nexus-blue-100 via-white to-nexus-blue-100"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2
          className="text-2xl font-bold mb-6 text-nexus-blue-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Login to Nexus
        </motion.h2>
        <form onSubmit={handleSubmit}>
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-nexus-blue-600 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 p-2 text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </motion.div>
          <motion.div
            className="mb-6 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-nexus-blue-600 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nexus-blue-300 focus:ring focus:ring-nexus-blue-200 focus:ring-opacity-50 text-nexus-blue-800 pr-10 p-2 text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <HiEyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <HiEye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </motion.div>
          <motion.button
            type="submit"
            className="w-full bg-nexus-blue-600 text-white rounded-md py-2 px-4 hover:bg-nexus-blue-700 focus:outline-none focus:ring-2 focus:ring-nexus-blue-500 focus:ring-opacity-50 text-base"
          >
            Log In
          </motion.button>
        </form>
        <motion.p
          className="mt-4 text-center text-sm text-nexus-blue-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-nexus-blue-800 group relative"
          >
            REGISTER HERE
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;