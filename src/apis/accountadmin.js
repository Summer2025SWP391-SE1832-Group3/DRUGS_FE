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
  },
  searchAccounts: async ({ email, username, role }) => {
    try {
      const params = [];
      if (email) params.push(`email=${encodeURIComponent(email)}`);
      if (username) params.push(`username=${encodeURIComponent(username)}`);
      if (role) params.push(`role=${encodeURIComponent(role)}`);
      const url = `/Account/admin/search${params.length ? '?' + params.join('&') : ''}`;
      const { data } = await axiosInstance.get(url);
      return data;
    } catch (error) {
      handleError(error);
    }
  },
  changeRole: async (userId, newRole) => {
    try {
      const { data } = await axiosInstance.put(`/Account/admin/update/${encodeURIComponent(userId)}?newRole=${encodeURIComponent(newRole)}`);
      return data;
    } catch (error) {
      handleError(error);
    }
  }
};
