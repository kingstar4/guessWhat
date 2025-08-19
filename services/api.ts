import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  
  if (Platform.OS === 'android') {
    // For Android emulator
    return `http://192.168.0.135:3000`;
  } else if (Platform.OS === 'ios') {
    // For iOS simulator
    return `http://192.168.0.135:3000`;
  } else {
    // For web or other platforms
    return 'http://localhost:3000';
  }
};

const BASE_URL = getBaseUrl();
const api = axios.create({
  baseURL: BASE_URL,
});

export interface Category {
  id: number;  
  term: string;
  tabooWords: string[];
}

export const fetchCategoryWords = async (category: string): Promise<Category[]> => {
  try {
    // Convert category name to match db.json endpoints
    const endpoint = category.toLowerCase()
    const { data } = await api.get(`/${endpoint}`);
    console.log('Fetched category words:', data);
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from server');
    }
    
    if (data.length === 0) {
      throw new Error(`No words available for category: ${category}`);
    }
    
    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`Category not found: ${category}`);
    }
    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to the server. Please make sure json-server is running on port 3000');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export default api;
