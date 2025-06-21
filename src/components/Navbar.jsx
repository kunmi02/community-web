import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Community</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Feed
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/groups" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Groups
                  </Link>
                  <Link to="/posts/new" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Create Post
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
