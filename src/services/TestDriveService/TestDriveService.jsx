// src/services/TestDriveService/TestDriveService.js
import { apiClient } from "../../api/apiClient";

const TestDriveService = {
    // LẤY DANH SÁCH STORE
    getAllStores: async () => {
        try {
            // baseURL đã có /api/ → chỉ cần "Store"
            const response = await apiClient.get("Store");
            return response.data;
        } catch (error) {
            console.error("Error fetching stores:", error);
            throw error;
        }
    },

    // TẠO KHÁCH HÀNG
    createCustomer: async (customerData) => {
        try {
            // baseURL đã có /api/ → chỉ cần "Customer"
            const response = await apiClient.post("Customer", customerData);
            return response.data;
        } catch (error) {
            console.error("Error creating customer:", error);
            throw error;
        }
    },
};

export default TestDriveService;