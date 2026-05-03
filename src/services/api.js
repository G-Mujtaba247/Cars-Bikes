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
