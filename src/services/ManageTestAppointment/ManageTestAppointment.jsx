// src/services/ManageTestAppointment.js
import { apiClient } from "../../api/apiClient";

const ManageTestAppointment = {
    // LẤY TẤT CẢ YÊU CẦU TỪ KHÁCH
    getAllRequests: async () => {
        try {
            const response = await apiClient.get("Customer");
            return response.data;
        } catch (error) {
            console.error("Error fetching requests:", error);
            throw error;
        }
    },

    // LẤY TẤT CẢ LỊCH HẸN
    getAllAppointments: async () => {
        try {
            const response = await apiClient.get("TestAppointments");
            return response.data;
        } catch (error) {
            console.error("Error fetching appointments:", error);
            throw error;
        }
    },

    // LẤY THÔNG TIN KHÁCH HÀNG
    getCustomerById: async (id) => {
        try {
            const response = await apiClient.get(`Customer/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer:", error);
            throw error;
        }
    },

    // LẤY THÔNG TIN XE
    getVehicleById: async (id) => {
        try {
            const response = await apiClient.get(`Vehicles/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching vehicle:", error);
            throw error;
        }
    },

    // LẤY THÔNG TIN DEALER
    getDealerById: async (id) => {
        try {
            const response = await apiClient.get(`Dealers/${id}`); // ← Bỏ params
            return response.data;
        } catch (error) {
            console.error("Error fetching dealer:", error.response?.data || error);
            throw error;
        }
    },
    // TẠO LỊCH HẸN
    createAppointment: async (data) => {
        try {
            const response = await apiClient.post("TestAppointments", data);
            return response.data;
        } catch (error) {
            console.error("Error creating appointment:", error);
            throw error;
        }
    },
};

export default ManageTestAppointment;