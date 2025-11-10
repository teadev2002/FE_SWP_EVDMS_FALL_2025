import { apiClient } from "../../api/apiClient";

const FeedbackService = {
 getAllFeedback: async () => {
    try {
      const response = await apiClient.get("Feedbacks");
      return response.data;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  },
    addFeedback: async (feedback) => {
    try {
      const response = await apiClient.post("Feedbacks", feedback);
      return response.data;
    } catch (error) {
      console.error("Error adding feedback:", error);
      throw error;
    }
  },
  updateFeedback: async (feedbackId, updatedFeedback) => {
    try {
      const response = await apiClient.put(`Feedbacks/${feedbackId}`, updatedFeedback);
      return response.data;
    }           
    catch (error) {
      console.error("Error updating feedback:", error);
      throw error;
    }
  },
    deleteFeedback: async (feedbackId) => { 
    try {
      const response = await apiClient.delete(`Feedbacks/{id}?id=${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw error;
    }
  },
};

export default FeedbackService;
