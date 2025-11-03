import { apiClient } from "../../api/apiClient";

const ManagePaymentService = {
  createPayment: async (data) => {
    try {
      const response = await apiClient.post("v1/payment/create", data);
      return response.data; // Trả về { checkoutUrl, paymentId, ... }
    } catch (error) {
      console.error("Lỗi tạo thanh toán:", error);
      throw error;
    }
  },
};

export default ManagePaymentService;