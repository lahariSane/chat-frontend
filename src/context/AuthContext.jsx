import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the full user object here
  const [token, setToken] = useState(null); // Store JWT token here
  const [socket, setSocket] = useState(null); // Store the socket instance here

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });
      const data = await response.json();
      if (data.jwt) {
        setUser(data.user);  // Set the entire user object
        setToken(data.jwt);
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('user', data.user.id);
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
    
  };

  const logout = () => {
    localStorage.clear(); // Clear all stored data
    setUser(null);
    setToken(null);

    // Disconnect the socket when the user logs out
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    // Clean up socket on unmount (optional, for better cleanup)
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [socket]);

  return (
    <AuthContext.Provider value={{ user, token, socket, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; // Export AuthContext to use it for direct access
