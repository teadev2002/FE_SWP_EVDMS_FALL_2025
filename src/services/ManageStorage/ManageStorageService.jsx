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

};
 
export default ManageStorageService;