import { apiClient } from "../../api/apiClient";

const LoginService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post("Auth/login", {
        email,
        password
      });
      return response.data;             
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }   
  },
};

export default LoginService;