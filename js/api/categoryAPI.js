import axiosClient from "./axiosClient";

export const categoryAPI = {
  getAll(params, token) {
    const url = '/private/Category/Get-all-categories';
    return axiosClient.get(url, {
      params,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}

export default categoryAPI;