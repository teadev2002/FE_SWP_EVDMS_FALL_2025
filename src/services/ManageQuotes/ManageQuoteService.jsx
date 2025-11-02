import React from 'react'
import { apiClient } from "../../api/apiClient";
import { Edit } from 'lucide-react';
const ManageQuoteService = {
    getAllQuotations: async () => {
        try {
          const response = await apiClient.get("Quotes");
          return response.data;
        } catch (error) {
          console.error("Error fetching vehicles:", error);
          throw error;
        }
      },
        GetQuotationById: async (id) => {
        try {
            const response = await apiClient.get(`Quotes/{id}?id=${id}`);  
        return response.data;
        } catch (error) {
          console.error("Error fetching dealer by ID:", error);
          throw error;
        }
      },
      AddQuotation: async (data) => {
        try {
          const response = await apiClient.post("Quotes", data);
          return response.data;
        } catch (error) {
          console.error("Error adding quotation:", error);
          throw error;
        }
      },
      EditQuotation: async (id, data) => {
        try {
          const response = await apiClient.put(`Quotes/{id}?id=${id}`, data);
          return response.data;
        } catch (error) {
          console.error("Error updating quotation:", error);
          throw error;
        }
      },
      DeleteQuotation: async (id) => {
        try {
          const response = await apiClient.delete(`Quotes/{id}?id=${id}`);
          return response.data;
        } catch (error) {
          console.error("Error deleting quotation:", error);
          throw error;
        }
      },

}

export default ManageQuoteService