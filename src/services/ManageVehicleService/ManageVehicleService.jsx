// import { apiClient } from "../../api/apiClient";


// const ManageVehicleService =  {
//   getAllVehicle: async () => {
//     try {
//       const response = await apiClient.get("/Vehicles");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching vehicles:", error);
//       throw error;
//     }
//   },
//   GetVehicleById: async (id) => {
//     try {
// const response = await apiClient.get(`Vehicles/{id}?id=${id}`);  
//     return response.data;
//     } catch (error) {
//       console.error("Error fetching dealer by ID:", error);
//       throw error;
//     }
//   },


// }

// export default ManageVehicleService

//---------------------------------------------------------------------------------------------------------//


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
      const response = await apiClient.get(`Vehicles/{id}?id=${id}`);
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
};

export default ManageVehicleService;