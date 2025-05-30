import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

import { AuthState, LoginCredentials, RegisterData, User } from '../types';
import { loginUser, registerUser, logoutUser } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        // Verify token is valid
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired
          handleLogout();
        } else {
          // Token valid
          setAuthState({
            user: JSON.parse(userData),
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch (error) {
        // Invalid token
        handleLogout();
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { user, token } = await loginUser(credentials);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      navigate('/dashboard');
      toast.success('Successfully logged in!');
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { user, token } = await registerUser(data);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      navigate('/dashboard');
      toast.success('Registration successful!');
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    navigate('/login');
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};