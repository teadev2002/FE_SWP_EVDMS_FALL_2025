import { apiClient } from "../../api/apiClient";

 
const ManageServiceVehicle =  {
  getAllVehicle: async () => {
    try {
      const response = await apiClient.get("/bike");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  }
    
}

export default ManageServiceVehicle