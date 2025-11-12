// src/services/DealerDashboard/DealerDashboardService.js
import { apiClient } from "../../api/apiClient";

const DealerDashboardService = {
    getSummary: async (storeId) => {
        try {
            const response = await apiClient.get(`Dashboard/summary?storeId=${storeId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching summary:", error);
            throw error;
        }
    },

    getTopDealer: async (storeId) => {
        try {
            const response = await apiClient.get(`Dashboard/top-dealer?storeId=${storeId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching top dealer:", error);
            throw error;
        }
    },

    getTopCustomer: async (storeId) => {
        try {
            const response = await apiClient.get(`Dashboard/top-customer?storeId=${storeId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching top customer:", error);
            throw error;
        }
    },

    getRevenueByMonth: async (storeId) => {
        try {
            const response = await apiClient.get(`Dashboard/revenue-by-month?storeId=${storeId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching revenue by month:", error);
            throw error;
        }
    },

    getTopVehicles: async (storeId, top = 5) => {
        try {
            const response = await apiClient.get(`Dashboard/top-vehicles?storeId=${storeId}&top=${top}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching top vehicles:", error);
            throw error;
        }
    },

    getBottomVehicles: async (storeId, top = 5) => {
        try {
            const response = await apiClient.get(`Dashboard/bottom-vehicles?storeId=${storeId}&top=${top}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching bottom vehicles:", error);
            throw error;
        }
    },
};

export default DealerDashboardService;