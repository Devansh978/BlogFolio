import { LoginCredentials, RegisterData, User } from '../types';

// Simulated backend response
interface AuthResponse {
  user: User;
  token: string;
}

// Simulated users database
const users: User[] = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    createdAt: new Date().toISOString(),
  },
];

// Simulate login API call
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be an API call to your backend
  if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
    return {
      user: users[0],
      token: generateJWT(users[0]),
    };
  }
  
  throw new Error('Invalid credentials');
};

// Simulate registration API call
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  if (users.some(user => user.email === data.email)) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: data.name,
    email: data.email,
    createdAt: new Date().toISOString(),
  };
  
  // Add to our simulated database
  users.push(newUser);
  
  return {
    user: newUser,
    token: generateJWT(newUser),
  };
};

// Simulate logout API call
export const logoutUser = async (): Promise<void> => {
  // In a real app, this might invalidate the token on the server
  await new Promise(resolve => setTimeout(resolve, 300));
  return;
};

// Helper function to generate JWT token (simulated)
function generateJWT(user: User): string {
  // This is a simplified JWT that would normally be created on the server
  // In a real app, you would use a proper JWT library
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    name: user.name,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  }));
  const signature = btoa('fake-signature'); // In a real app, this would be properly signed
  
  return `${header}.${payload}.${signature}`;
}