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
  }
};
