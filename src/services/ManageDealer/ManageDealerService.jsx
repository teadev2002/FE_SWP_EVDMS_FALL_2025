import { apiClient } from "../../api/apiClient";
const ManageDealerService =  {
  getAllDealers: async () => {
    try {
      const response = await apiClient.get("Dealers");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },        
  GetDealerById: async (id) => {
    try {
const response = await apiClient.get(`Dealers/{id}?id=${id}`);  
    return response.data;
    } catch (error) {
      console.error("Error fetching dealer by ID:", error);
      throw error;
    }
  },
  AddDealer: async (dealerData) => {
    try {
      const response = await apiClient.post("Dealers", dealerData);
      return response.data;
    } catch (error) {
      console.error("Error adding dealer:", error);
      throw error;
    }
  },
  UpdateDealer: async (dealerId, dealerData) => {
    try {
      const response = await apiClient.put(`Dealers/{id}?id=${dealerId}`, dealerData);
      return response.data;
    } catch (error) {
      console.error("Error updating dealer:", error);
      throw error;
    }
  },
  DeleteDealer: async (dealerId) => {
    try {
      const response = await apiClient.delete(`Dealers/{id}?id=${dealerId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting dealer:", error);
      throw error;
    }
  },



}

export default ManageDealerService;