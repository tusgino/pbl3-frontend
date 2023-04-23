import axiosClient from "../api/axiosClient";

const userAPI = {

  getAllUsersByFiltering(params, token) {
    const url = '/User/Get-all-users-by-filtering';
    return axiosClient.get(url, {params },
      {
      headers: {
        // 'Content-Type' : 'application/json',
        // 'Accept' : 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
    );
  },
  
}

export default userAPI;