import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and set user
    const checkAuth = async () => {
      if (token) {
        try {
          // You can add a profile endpoint call here to get user data
          // const response = await axios.get('users/profile/');
          // setUser(response.data);
          setUser({ isAuthenticated: true });
        } catch (error) {
          console.error('Authentication error:', error);
          // Try to refresh the token if authentication fails
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post('token/refresh/', { refresh: refreshToken });
              const { access } = response.data;
              localStorage.setItem('token', access);
              setToken(access);
              setUser({ isAuthenticated: true });
            } else {
              logout();
            }
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await axios.post('login/', credentials);
      const { access, refresh } = response.data;
      
      // Store refresh token as well
      localStorage.setItem('refreshToken', refresh);
      
      localStorage.setItem('token', access);
      setToken(access);
      setUser({ isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
