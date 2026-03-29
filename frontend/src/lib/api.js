import axios from 'axios';

// ✅ Ensure API URL exists
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("❌ VITE_API_URL is NOT defined. Check your .env / Vercel settings.");
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // ⏱ prevent hanging requests
});

export const api = {
  // =========================
  // TDEE
  // =========================
  calculateTDEE: async (data) => {
    try {
      const response = await apiClient.post('/calculate-tdee', data);
      return response.data;
    } catch (error) {
      console.error('❌ API Error (calculateTDEE):', error.response?.data || error.message);
      throw error;
    }
  },

  // =========================
  // MEAL PLAN
  // =========================
  generateMealPlan: async (data) => {
    try {
      const response = await apiClient.post('/generate-meal-plan', data);
      return response.data;
    } catch (error) {
      console.error('❌ API Error (generateMealPlan):', error.response?.data || error.message);
      throw error;
    }
  },

  // =========================
  // SNAP COOK
  // =========================
  snapCook: async (imageFile, remainingMacros) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      if (remainingMacros) {
        formData.append('remaining_macros', JSON.stringify(remainingMacros));
      }

      const response = await axios.post(
        `${API_BASE_URL}/snap-cook`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ API Error (snapCook):', error.response?.data || error.message);
      throw error;
    }
  },

  // =========================
  // FOOD SEARCH
  // =========================
  searchFood: async (query, healthConditions = []) => {
    try {
      const params = new URLSearchParams();
      params.append('q', query);

      healthConditions.forEach((condition) =>
        params.append('health_conditions', condition)
      );

      const response = await apiClient.get(`/food-search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('❌ API Error (searchFood):', error.response?.data || error.message);
      throw error;
    }
  },
};