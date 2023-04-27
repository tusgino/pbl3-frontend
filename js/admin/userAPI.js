import axios from "axios";
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
    return axiosClient.get(url, {params});
  },
  updateUser(params, token) {
    const url = `/private/User/${params.id}`;
    const config = {
      headers: {
        'Content-Type' : 'application/json-patch+json',
        // 'Authorization': `Bearer ${token}`,
      }
    }
    return axiosClient.patch(url, params.patchDoc, config);
  },
  getAllStudentsForAnalytics(params, token) {
    const url = '/private/User/Get-all-students-for-analytics';
    const config = {
        headers : {
            'Authorization' : `Bearer ${token}`,        
        } 
    }
    return axiosClient.get(url, {params});
  },
  getAllExpertsForAnalytics(params, token) {
    const url = '/private/User/Get-all-experts-for-analytics';
    const config = {
        headers : {
            'Authorization' : `Bearer ${token}`,        
        } 
    }
    return axiosClient.get(url, {params});
  },
  getByID(params, token) {
    const url = `/private/User/get-user`;
    const config = {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.get(url, config);
  },
  getAllUsersByType(params, token) {
    const url = `/private/User/Get-all-users-by-type`;
    const config = {
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return axiosClient.get(url);
  },
  getNewUsers(params, token) {
    const url = `/private/User/Get-new-users`;
    const config = {
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return axiosClient.get(url);
  },
}

export default userAPI;