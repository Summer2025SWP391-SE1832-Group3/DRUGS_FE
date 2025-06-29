import axiosInstance from "./axiosInstance";

const handleError = (error) => { throw error; };

export const AccountAdminAPI = {
  createAccount: async ({ userName, password, role }) => {
    try {
      const { data } = await axiosInstance.post(
        `/Account/admin/createAccount?role=${encodeURIComponent(role)}`,
        { userName, password }
      );
      return data;
    } catch (error) {
      handleError(error);
    }
  },
  updateAccountRole: async (userId, newRole, data) => {
    try {
      const { data: resData } = await axiosInstance.put(
        `/Account/admin/update/${encodeURIComponent(userId)}?newRole=${encodeURIComponent(newRole)}`,
        data
      );
      return resData;
    } catch (error) {
      handleError(error);
    }
  },
  deleteAccount: async (userId) => {
    try {
      const { data } = await axiosInstance.delete(`/Account/admin/delete/${encodeURIComponent(userId)}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  },
  getAllAccounts: async () => {
    try {
      const { data } = await axiosInstance.get('/Account/admin/all-account');
      return data;
    } catch (error) {
      handleError(error);
    }
  }
};
