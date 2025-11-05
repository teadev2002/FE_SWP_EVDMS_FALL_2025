// src/services/ManageTestAppointment.js
import { apiClient } from "../../api/apiClient";

const ManageTestAppointment = {
    // LẤY TẤT CẢ YÊU CẦU TỪ KHÁCH THEO STORE
    getAllRequests: async () => {
        try {
            // Lấy storeId từ localStorage (key là 'dealerInfo' chứa object dealer/staff)
            const dealerInfoStr = localStorage.getItem('dealerInfo');
            if (!dealerInfoStr) {
                throw new Error('No dealerInfo in localStorage');
            }
            const dealerInfo = JSON.parse(dealerInfoStr);
            const storeId = dealerInfo.storeId;
            if (!storeId) {
                throw new Error('No storeId found in dealerInfo');
            }

            // Gọi API với path param storeId
            const response = await apiClient.get(`Customer/store/${storeId}/customers`);
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
            // Sử dụng query param để khớp với API spec: /api/Dealers?id={id}
            const response = await apiClient.get("Dealers", {
                params: { id }
            });
            // Nếu response là array (filtered list), lấy item đầu tiên
            const dealerData = Array.isArray(response.data) ? response.data[0] : response.data;
            if (!dealerData) {
                throw new Error(`No dealer found for id ${id}`);
            }
            return dealerData;
        } catch (error) {
            console.error(`Error fetching dealer ${id}:`, error.response?.data || error);
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