import { apiClient } from "../../api/apiClient";

const ManageVehicleService = {
  getAllVehicle: async () => {
    try {
      const response = await apiClient.get("/Vehicles");
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw error;
    }
  },
  GetVehicleById: async (id) => {
    try {
      const response = await apiClient.get(`Vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicle by ID:", error);
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
  },
  AddVehicle: async (vehicleData) => {
    try {
      const response = await apiClient.post("Vehicles", vehicleData);
      return response.data;
    } catch (error) {
      console.error("Error adding vehicle:", error);
      throw error;
    }
  },
  updateVehicle: async (vehicleId, vehicleData) => {
    try {
      const response = await apiClient.put(`Vehicles/${vehicleId}`, vehicleData);
      return response.data;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      throw error;
    }
  },
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await apiClient.delete(`Vehicles/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      throw error;
    }
  },
  getAllVehicleByBrandId: async (brandId) => {
    try {
      const response = await apiClient.get(`Vehicles/brand/${brandId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles by brand ID:", error);
      throw error;
    }
  },
  getAllVehicleByStoreId: async (storeId) => {
    try {
      const response = await apiClient.get(`Vehicles/store/${storeId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching vehicles by store ID:", error);
      throw error;
    }
  },


};

export default ManageVehicleService;