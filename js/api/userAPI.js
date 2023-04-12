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
}

export default userAPI;