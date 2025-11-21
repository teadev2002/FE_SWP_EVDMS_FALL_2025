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
  addOrder: async (order) => {
    try {
      const response = await apiClient.post("Order", order);
      return response.data;
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  },
  updateOrder: async (orderId, updatedOrder) => {
    try {
      const response = await apiClient.put(`Order/${orderId}`, updatedOrder);
      return response.data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },
  deleteOrder: async (orderId) => {
    try {
      const response = await apiClient.delete(`Order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`Order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  },
  getOrderByStoreId: async (storeId) => {
    try {
      const response = await apiClient.get(`Order/store/${storeId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders by store ID:", error);
      throw error;
    }
  },

          
}

export default ManageOrdersService;