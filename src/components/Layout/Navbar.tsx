import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PlusCircle, LogIn, LogOut, User, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-teal-700 text-white' : 'text-gray-200 hover:bg-teal-700 hover:text-white';
  };

  return (
    <nav className="bg-teal-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <Logo className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-xl">Lost&Found Portal</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/')}`}>
                  Home
                </Link>
                <Link to="/lost" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/lost')}`}>
                  Lost Items
                </Link>
                <Link to="/found" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/found')}`}>
                  Found Items
                </Link>
                {user && (
                  <Link to="/myposts" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/myposts')}`}>
                    My Posts
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Desktop Right Side Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <Link to="/search" className="text-gray-200 hover:text-white p-1">
                <Search className="h-5 w-5" />
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/new"
                    className="flex items-center bg-white text-teal-600 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <PlusCircle className="h-4 w-4 mr-1.5" />
                    New Post
                  </Link>
                  <div className="relative ml-3">
                    <button
                      onClick={() => signOut()}
                      className="flex items-center text-gray-200 hover:text-white"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="ml-1.5">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-gray-200 hover:text-white"
                >
                  <LogIn className="h-5 w-5 mr-1.5" />
                  Login
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-teal-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-teal-600 pb-3 px-2 pt-2 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/lost"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/lost')}`}
            onClick={closeMenu}
          >
            Lost Items
          </Link>
          <Link
            to="/found"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/found')}`}
            onClick={closeMenu}
          >
            Found Items
          </Link>
          {user && (
            <Link
              to="/myposts"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/myposts')}`}
              onClick={closeMenu}
            >
              My Posts
            </Link>
          )}
          <Link
            to="/search"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/search')}`}
            onClick={closeMenu}
          >
            Search
          </Link>
          
          <div className="pt-4 pb-3 border-t border-teal-700">
            {user ? (
              <div className="space-y-1">
                <Link
                  to="/new"
                  className="flex items-center bg-white text-teal-600 px-3 py-2 rounded-md text-base font-medium w-full"
                  onClick={closeMenu}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  New Post
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="flex items-center text-gray-200 hover:text-white w-full px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;