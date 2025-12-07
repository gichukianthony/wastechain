import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This will be proxied to localhost:8000
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  // const response = await api.post('/auth/login', { email, password });
  // return response.data;

  // Mock login for now since backend might not be fully ready/runnable
  return new Promise((resolve) => {
    setTimeout(() => {
        const mockUser = {
            id: 1,
            email,
            role: 'household', // Default role for testing
            firstName: 'Test',
            lastName: 'User'
        };
        resolve({
            access_token: 'mock-jwt-token',
            user: mockUser
        });
    }, 1000);
  });
};

export const register = async (userData) => {
  // const response = await api.post('/users', userData);
  // return response.data;

  // Mock register
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve({ id: Math.random(), ...userData });
      }, 1000);
  });
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Waste related API calls
export const createWasteRequest = async (data) => {
    // return api.post('/waste/requests', data);
    console.log("Creating waste request:", data);
    return Promise.resolve({ id: 123, status: 'PENDING', ...data });
};

export const getWasteRequests = async () => {
    // return api.get('/waste/requests');
    return Promise.resolve([
        { id: 1, type: 'Plastic', weight: 2.5, status: 'PENDING', date: '2023-10-26' },
        { id: 2, type: 'Paper', weight: 1.0, status: 'COLLECTED', date: '2023-10-25' },
    ]);
};

// Marketplace API calls
export const getMarketplaceItems = async () => {
    // return api.get('/marketplace');
     return Promise.resolve([
        { id: 1, title: 'Bulk Plastic Bottles', quantity: '50kg', price: '$20', seller: 'Collector A' },
        { id: 2, title: 'Cardboard Bales', quantity: '100kg', price: '$15', seller: 'Collector B' },
    ]);
};

// Rewards API calls
export const getRewards = async () => {
    // return api.get('/rewards');
    return Promise.resolve([
        { id: 1, title: 'Amazon Gift Card', cost: 500, description: '$5 Gift Card' },
        { id: 2, title: 'Supermarket Voucher', cost: 1000, description: '$10 Voucher' },
    ]);
};

export const getUserRewards = async () => {
    return Promise.resolve({ points: 750 });
}

export default api;
