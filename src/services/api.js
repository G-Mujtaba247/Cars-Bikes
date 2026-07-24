import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchCars = async () => {
  const response = await axios.get(`${API_URL}/cars`);
  return response.data;
};

export const fetchBikes = async () => {
  const response = await axios.get(`${API_URL}/bikes`);
  return response.data;
};

export const fetchAllVehicles = async () => {
  const [cars, bikes] = await Promise.all([fetchCars(), fetchBikes()]);
  return [...cars, ...bikes];
};

export const addVehicle = async (vehicle) => {
  const endpoint = vehicle.type === 'car' ? 'cars' : 'bikes';
  const response = await axios.post(`${API_URL}/${endpoint}`, vehicle);
  return response.data;
};

export const updateVehicle = async (vehicle) => {
  const endpoint = vehicle.type === 'car' ? 'cars' : 'bikes';
  const response = await axios.put(`${API_URL}/${endpoint}/${vehicle.id}`, vehicle);
  return response.data;
};

export const deleteVehicle = async (id, type) => {
  const endpoint = type === 'car' ? 'cars' : 'bikes';
  const response = await axios.delete(`${API_URL}/${endpoint}/${id}`);
  return response.data;
};

export const login = async (username, password) => {
  // Note: json-server doesn't support POST for auth by default without custom routes.
  // To avoid sending password in URL query, we fetch users by username and verify password locally.
  // WARNING: This is only for demonstration. A real backend should use POST and hash passwords.
  const response = await axios.get(`${API_URL}/users?username=${username}`);
  const users = response.data;
  const user = users.find(u => u.password === password);
  return user ? [user] : [];
};

