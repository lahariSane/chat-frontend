import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ChatLogin = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate email format
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Make API request to check email
      const response = await axios.post(
        `http://localhost:1337/api/checkUserEmail`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Save receiver ID and navigate to chat room
      localStorage.setItem('receiver', response.data.userId);
      navigate('/chatRoom');
    } catch (error) {
      console.error(error);

      // Handle specific error responses or fallback to generic error
      if (error.response && error.response.status === 404) {
        setError('User not found. Please enter a valid email.');
      } else if (error.response && error.response.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else {
        setError('Unable to log in. Please try again.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logout(); // Call the logout function from AuthContext
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Error during sign out:', err);
      setError('An error occurred while signing out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join the Chat Room
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the email of the user you want to chat with
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          {/* Error message display */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Enter Chat Room
          </button>
        </form>

        <button
          onClick={handleSignOut}
          className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ChatLogin;
