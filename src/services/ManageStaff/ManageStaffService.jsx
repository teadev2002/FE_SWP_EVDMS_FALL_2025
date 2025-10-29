import { apiClient } from "../../api/apiClient";
const ManageStaffService =  {    
  getAllStaffs: async () => {
    try {
      const response = await apiClient.get("Staffs");
      return response.data;
    } catch (error) {
      console.error("Error fetching staffs:", error);
      throw error;
    }
  },
    GetStaffById: async (id) => {
    try {
const response = await apiClient.get(`Staffs/{id}?id=${id}`);  
    return response.data;
    } catch (error) {
      console.error("Error fetching staff by ID:", error);
      throw error;
    }
  },
    AddStaff: async (staffData) => {    
    try {
      const response = await apiClient.post("Auth/CreateEVMStaff", staffData);
      return response.data;
    } catch (error) {
      console.error("Error adding staff:", error);
      throw error;
    }
  },
    UpdateStaff: async (staffId, staffData) => {
    try {
      const response = await apiClient.put(`Staffs/{id}?id=${staffId}`, staffData);
      return response.data;
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  },
    DeleteStaff: async (staffId) => {
    try {
      const response = await apiClient.delete(`Staffs/{id}?id=${staffId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  },


}

export default ManageStaffService;