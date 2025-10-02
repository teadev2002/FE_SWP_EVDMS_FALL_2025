import { apiClient } from "../../api/apiClient";

const ManageServicePromotions =  {
  getAllPromotions: async () => {
    try {
      const response = await apiClient.get("Promotion");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },
  AddPromotion: async (promotion) => {
    try {
      const response = await apiClient.post("Promotion", promotion);
      return response.data;
    } catch (error) {
      console.error("Error adding promotion:", error);
      throw error;
    }
  },
  editPromotion: async (id, promotion) => {
    try {
      const response = await apiClient.put(`Promotion/${id}`, promotion);
      return response.data;
    } catch (error) {
      console.error("Error editing promotion:", error);
      throw error;
    }
  },
  deletePromotion: async (id) => {
    try {
      const response = await apiClient.delete(`Promotion/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting promotion:", error);
      throw error;
    }
  },
}

export default ManageServicePromotions;



 