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
}

export default ManageDealerService;