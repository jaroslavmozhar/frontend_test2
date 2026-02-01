import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${API_URL}/api`;

// API клієнт для роботи з серіалами
const seriesAPI = {
  // Архів серіалів
  getAllSeries: async () => {
    try {
      const response = await axios.get(`${API_BASE}/series`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching series:', error);
      return { success: false, error: error.message };
    }
  },

  createSeries: async (series) => {
    try {
      const response = await axios.post(`${API_BASE}/series`, series);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error creating series:', error);
      return { success: false, error: error.message };
    }
  },

  updateSeries: async (id, series) => {
    try {
      const response = await axios.put(`${API_BASE}/series/${id}`, series);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error updating series:', error);
      return { success: false, error: error.message };
    }
  },

  deleteSeries: async (id) => {
    try {
      await axios.delete(`${API_BASE}/series/${id}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting series:', error);
      return { success: false, error: error.message };
    }
  },

  // Список бажань
  getWishlist: async () => {
    try {
      const response = await axios.get(`${API_BASE}/wishlist`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error fetching wishlist:', error);
      return { success: false, error: error.message };
    }
  },

  createWishlistItem: async (series) => {
    try {
      const response = await axios.post(`${API_BASE}/wishlist`, series);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error creating wishlist item:', error);
      return { success: false, error: error.message };
    }
  },

  updateWishlistItem: async (id, series) => {
    try {
      const response = await axios.put(`${API_BASE}/wishlist/${id}`, series);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Error updating wishlist item:', error);
      return { success: false, error: error.message };
    }
  },

  deleteWishlistItem: async (id) => {
    try {
      await axios.delete(`${API_BASE}/wishlist/${id}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting wishlist item:', error);
      return { success: false, error: error.message };
    }
  }
};

export default seriesAPI;
