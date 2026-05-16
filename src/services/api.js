import axios from 'axios';

const API_URL = 'http://localhost:5000';

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
  const response = await axios.get(`${API_URL}/users`, {
    params: { username, password }
  });
  return response.data;
};

