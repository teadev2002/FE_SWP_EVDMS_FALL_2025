import { apiClient } from "../../api/apiClient";

const ManageCustomersService =  {
  getAllCustomers: async () => {
    try {
      const response = await apiClient.get("Customer");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },
  AddCustomer: async (customer) => {
    try {
      const response = await apiClient.post("Customer", customer);
      return response.data;
    } catch (error) {
      console.error("Error adding customer:", error);
      throw error;
    }
  },

    editCustomer: async (id, customer ) => {
        try {
        const response = await apiClient.put(`Customer/${id}`, customer);
        return response.data;
        } catch (error) {
        console.error("Error editing customer:", error);
        throw error;
        }   
    },

    deleteCustomer: async (id) => {
        try {
        const response = await apiClient.delete(`Customer/${id}`);
        return response.data;
        } catch (error) {
        console.error("Error deleting customer:", error);
        throw error;
        }
    }

    
}

export default ManageCustomersService;