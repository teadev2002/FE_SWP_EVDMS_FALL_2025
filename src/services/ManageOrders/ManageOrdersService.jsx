import { apiClient } from "../../api/apiClient";
const ManageOrdersService =  {
  getAllOrder: async () => {
    try {
      const response = await apiClient.get("Order");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },        
}

export default ManageOrdersService;