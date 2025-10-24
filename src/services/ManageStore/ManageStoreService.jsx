import { apiClient } from "../../api/apiClient";
const ManageStoreService =  {
  getAllStores: async () => {
    try {
      const response = await apiClient.get("Store");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },
  addStore: async (storeData) => {
    try {
      const response = await apiClient.post("Store", storeData);
      return response.data;
    } catch (error) {
      console.error("Error adding store:", error);
      throw error;
    }
  },
  updateStore: async (storeId, storeData) => {
    try {
      const response = await apiClient.put(`Store/${storeId}`, storeData);
      return response.data;
    } catch (error) {
      console.error("Error updating store:", error);
      throw error;
    }
  },
  deleteStore: async (storeId) => {
    try {
      const response = await apiClient.delete(`Store/${storeId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting store:", error);
      throw error;
    } 
  }, 
  getStoreById: async (storeId) => {
    try {
      const response = await apiClient.get(`Store/${storeId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching store by ID:", error);
      throw error;
    } 
  },      
}

export default ManageStoreService;