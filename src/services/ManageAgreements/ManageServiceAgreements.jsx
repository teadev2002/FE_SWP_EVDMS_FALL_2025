import { apiClient } from "../../api/apiClient";

const ManageServiceAgreements =  {
  getAllAgreements: async () => {
    try {
      const response = await apiClient.get("Agreements");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  }
    
}

export default ManageServiceAgreements