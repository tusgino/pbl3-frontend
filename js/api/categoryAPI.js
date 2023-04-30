import axiosClient from "./axiosClient";

export const categoryAPI = {
  getAll(params) {
    const url = '/private/Category/Get-all-categories';
    return axiosClient.get(url, { params });
  }
}

export default categoryAPI;