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
}

export default ManageStoreService;