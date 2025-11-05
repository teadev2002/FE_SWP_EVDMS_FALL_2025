// src/services/ManageOrdersByBrand/ManageOrdersByBrand.js
import { apiClient } from "../../api/apiClient";

const ManageOrdersByBrand = {
    // LẤY ORDERS THEO BRAND ID (SỬ DỤNG PATH /brand/{brandId})
    getOrdersByBrandId: async (brandId) => {
        try {
            const response = await apiClient.get(`Order/brand/${brandId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching orders by brand:", error);
            throw error;
        }
    },
};

export default ManageOrdersByBrand;