import axiosInstance from "./axiosInstance";

export const AccountAdminAPI = {
  createAccount: async ({ userName, password, role }) => {
    try {
      const response = await axiosInstance.post(
        `/Account/admin/createAccount?role=${encodeURIComponent(role)}`,
        { userName, password }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateAccountRole: async (userId, newRole, data) => {
    try {
      const response = await axiosInstance.put(
        `/Account/admin/update/${encodeURIComponent(userId)}?newRole=${encodeURIComponent(newRole)}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteAccount: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/Account/admin/delete/${encodeURIComponent(userId)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllAccounts: async () => {
    try {
      const response = await axiosInstance.get('/Account/admin/all-account');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
