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

}

export default ManageDealerService;