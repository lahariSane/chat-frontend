import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import InputField from './../input/InputField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Call the login function from AuthContext
      navigate('/'); // Redirect to the home page on successful login
    } catch (err) {
      setError('Invalid email or password. Please try again.'); // Show error message
    }
  };

  return (
      <form
        onSubmit={handleLogin}
      >
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <InputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
  );
};

export default Login;
