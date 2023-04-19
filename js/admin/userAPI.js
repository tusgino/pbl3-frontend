import axiosClient from "../api/axiosClient";

const userAPI = {

  getAllUsersByFiltering(params, token) {
    const url = '/private/User/Get-all-users-by-filtering';
    const config = {
      headers: {
        // 'Content-Type' : 'application/json',
        // 'Accept' : 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }
    return axiosClient.get(url, {params });
  },
  
}

export default userAPI;