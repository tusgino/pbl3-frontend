import axiosClient from "./axiosClient";

export const userAPI = {
  getByID(params, token) {
    const url = `/User/get-user`;
    const config = {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.get(url, config);
  },

  updateByID(id, data, token) {
    const url = `/User/${id}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json',
      }
    }
    return axiosClient.patch(url, data, config);
  }
}

export default userAPI;