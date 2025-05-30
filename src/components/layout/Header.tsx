import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Pencil, LogOut } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container-wide py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center" onClick={closeMenu}>
          <Pencil className="mr-2" size={24} />
          <span>BlogFolio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={twMerge(
              "text-gray-700 hover:text-primary-600 transition-colors",
              isActive('/') && "text-primary-600 font-medium"
            )}
          >
            Home
          </Link>
          <Link 
            to="/blogs" 
            className={twMerge(
              "text-gray-700 hover:text-primary-600 transition-colors",
              isActive('/blogs') && "text-primary-600 font-medium"
            )}
          >
            Blogs
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={twMerge(
                  "text-gray-700 hover:text-primary-600 transition-colors",
                  isActive('/dashboard') && "text-primary-600 font-medium"
                )}
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hi, {user?.name}
                </span>
                <button 
                  onClick={logout}
                  className="btn btn-outline text-sm py-1.5 px-3"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn btn-outline text-sm py-1.5 px-3">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary text-sm py-1.5 px-3">
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
          <div className="container-wide py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={twMerge(
                "text-gray-700 hover:text-primary-600 transition-colors py-2",
                isActive('/') && "text-primary-600 font-medium"
              )}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              to="/blogs" 
              className={twMerge(
                "text-gray-700 hover:text-primary-600 transition-colors py-2",
                isActive('/blogs') && "text-primary-600 font-medium"
              )}
              onClick={closeMenu}
            >
              Blogs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={twMerge(
                    "text-gray-700 hover:text-primary-600 transition-colors py-2",
                    isActive('/dashboard') && "text-primary-600 font-medium"
                  )}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600 block mb-2">
                    Logged in as {user?.name}
                  </span>
                  <button 
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="btn btn-outline w-full justify-center"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2 border-t border-gray-100">
                <Link 
                  to="/login" 
                  className="btn btn-outline w-full justify-center"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary w-full justify-center"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;