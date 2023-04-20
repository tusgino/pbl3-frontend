import axios from "axios";
import axiosClient from "../api/axiosClient";

const userAPI = {

  getAllUsersByFiltering(params, token) {
    const config = {
      headers: {
        // 'Content-Type' : 'application/json',
        // 'Accept' : 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }
    const url = '/private/User/Get-all-users-by-filtering';
    return axiosClient.get(url, {params});
  },
  updateUser(params, token) {
    const url = '/private/User/Update-user-by-id';
    const config = {
      headers: {
        // 'Content-Type' : 'application/json',
        // 'Accept' : 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    }
    return axiosClient.get(url, {params});
  }
  
}

export default userAPI;