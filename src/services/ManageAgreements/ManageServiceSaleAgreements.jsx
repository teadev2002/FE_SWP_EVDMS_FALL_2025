import { apiClient } from "../../api/apiClient";

const ManageServiceSaleAgreements =  {
  getAllSaleAgreements: async () => {
    try {
      const response = await apiClient.get("Agreements");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },
  AddSaleAgreement: async (agreement) => {
    try {
      const response = await apiClient.post("Agreements", agreement);
      return response.data;
    } catch (error) {
      console.error("Error adding sale agreement:", error);
      throw error;
    }
  },
    editSaleAgreement: async (id, agreement ) => {
        try {
        const response = await apiClient.put(`Agreements/${id}`, agreement);
        return response.data;
        } catch (error) {
        console.error("Error editing sale agreement:", error);
        throw error;
        }   
    },
    deleteSaleAgreement: async (id) => {
        try {
        const response = await apiClient.delete(`Agreements/${id}`);
        return response.data;
        } catch (error) {
        console.error("Error deleting sale agreement:", error);
        throw error;
        }   
    },      
    getSaleAgreementById: async (id) => {
        try {
        const response = await apiClient.get(`Agreements/${id}`);
        return response.data;
        } catch (error) {
        console.error("Error fetching sale agreement by ID:", error);
        throw error;
        }   
    },
    
}

export default ManageServiceSaleAgreements