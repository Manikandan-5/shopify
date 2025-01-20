import axios from 'axios';

// Create a base axios instance
const apiClient = axios.create({
  baseURL: 'http://beta.hrmetrics.mv/interview/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptor to attach token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    if (token) {
      // Attach token to headers
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Api Connect functions
const ShopApi = {
  getItemCategories: async () => {
    try {
      const response = await apiClient.get('/Item/GetItemCategories');
      return response.data;
    } catch (error) {
      console.error('Error fetching item categories:', error);
      throw error;
    }
  },

  saveItem: async (itemData) => {
    try {
      const response = await apiClient.post('/Item/Save', itemData);
      return response.data;
    } catch (error) {
      console.error('Error saving item:', error.name);
      throw error;
    }
  },

  uploadImage: async (itemId, file) => {
    try {
      const formData = new FormData();
      formData.append('Id', itemId);
      formData.append('ImageFile', file);

      const response = await apiClient.post('/Item/UploadImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};

export default ShopApi;
