// services/ManageHomePage/ManageHomePageService.js
import { apiClient } from "../../api/apiClient";

const ManageHomePageService = {
    getAllVehicles: async () => {
        try {
            const response = await apiClient.get("Vehicles");
            return response.data;
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            throw error;
        }
    },

    getAllBrands: async () => {
        try {
            const response = await apiClient.get("Brands");
            return response.data;
        } catch (error) {
            console.error("Error fetching brands:", error);
            throw error;
        }
    },

    getAllStorages: async () => {
        try {
            const response = await apiClient.get("Storages");
            return response.data;
        } catch (error) {
            console.error("Error fetching storages:", error);
            throw error;
        }
    }
};

export default ManageHomePageService;