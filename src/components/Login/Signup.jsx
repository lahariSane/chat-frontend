import React from 'react';
import { useState } from 'react';
import InputField from './../input/InputField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ email, setEmail, password, setPassword, confirmPassword, setConfirmPassword }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API}/auth/local/register`, {
        username: email, // Using email as username
        email,
        password,
      });
      console.log(response);
      if (response.status == 200) {
        alert('Registration successful. Please log in.');
        window.location.reload();
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      console.error('Error during signup:', err);
      alert('Failed to register. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
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
      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
      />
      <button
        type="submit"
        className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
