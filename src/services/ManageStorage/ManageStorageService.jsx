import { apiClient } from "../../api/apiClient";
const ManageStorageService = {      
    getAllStorages: async () => {
    try {
      const response = await apiClient.get("Storages");
      return response.data;
    } catch (error) {
      console.error("Error fetching storages:", error);
      throw error;
    }       
    },
    getStorageVehiclesByStoreId: async (storageId) => {

        try {
            const response = await apiClient.get(`Storages/store/${storageId}/Vehicles`);
            return response.data;
        } catch (error) {
            console.error("Error fetching storage vehicles by store ID:", error);
            throw error;
        }
    },
    getStorageByBrandId: async (brandId) => {
        try {
            const response = await apiClient.get(`Storages/brand/${brandId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching storage by brand ID:", error);
            throw error;
        }
    },
    filterStorageByBrandIdAndVehicleId: async (brandId, vehicleId) => {
        try {
            const response = await apiClient.get(`Storages/filter?brandId=${brandId}&vehicleId=${vehicleId}`);
            return response.data;
        } catch (error) {
            console.error("Error filtering storage by brand ID and vehicle ID:", error);
            throw error;
        }
    },
    addToStock: async (storageData) => {
        try {
            const response = await apiClient.post("Storages", storageData);
            return response.data;
        } catch (error) {
            console.error("Error adding to stock:", error);
            throw error;
        }
    },
// ManageStorageService.js
vehicleAllocate: async (payload) => {
  try {
    const response = await apiClient.post(`Storages/allocate`, payload);
    return response.data;
  } catch (error) {
    console.error("Error allocating vehicle from storage:", error);
    throw error;
  }
},

    updateStorage: async (storageId, updatedStorage) => {
        try {
            const response = await apiClient.put(`Storages/${storageId}`, updatedStorage);
            return response.data;
        } catch (error) {
            console.error("Error updating storage:", error);
            throw error;
        }
    },



};
 
export default ManageStorageService;