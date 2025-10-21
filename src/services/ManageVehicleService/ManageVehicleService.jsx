import { apiClient } from "../../api/apiClient";

 
const ManageVehicleService =  {
  getAllVehicle: async () => {
    try {
      const response = await apiClient.get("/Vehicles");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },
  GetVehicleById: async (id) => {
    try {
const response = await apiClient.get(`Vehicles/{id}?id=${id}`);  
    return response.data;
    } catch (error) {
      console.error("Error fetching dealer by ID:", error);
      throw error;
    }
  },

    
}

export default ManageVehicleService