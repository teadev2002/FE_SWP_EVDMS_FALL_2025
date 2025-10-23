import { apiClient } from "../../api/apiClient";

 
const ManageBrandService =  {         
getAllBrands: async () => {
    try {
      const response = await apiClient.get("/Brands");
      return response.data;
    } catch (error) {
      console.error("Error fetching Brands:", error);
      throw error;
    }
  },
  GetBrandById: async (id) => {
    try {
    const response = await apiClient.get(`Brands/${id}`);  
    return response.data;
    } catch (error) {
      console.error("Error fetching dealer by ID:", error);
      throw error;
    }
    },
}
export default ManageBrandService;