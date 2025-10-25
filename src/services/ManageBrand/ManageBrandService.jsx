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
  CreateBrand: async (brandData) => {
    try {
      const response = await apiClient.post("/Brands", brandData);
      return response.data;
    } catch (error) {
      console.error("Error creating Brand:", error);
      throw error;
    }
  },
  UpdateBrand: async (id, brandData) => {
    try {
      const response = await apiClient.put(`/Brands/${id}`, brandData);
      return response.data;
    } catch (error) {
      console.error("Error updating Brand:", error);
      throw error;
    } 
  },
  DeleteBrand: async (id) => {
    try {
      const response = await apiClient.delete(`/Brands/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Brand:", error);
      throw error;
    } 
  },
}
export default ManageBrandService;