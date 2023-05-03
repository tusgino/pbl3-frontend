import axios from "axios";
import axiosClient from "../api/axiosClient";

const userAPI = {

  getAllUsersByFiltering(params, token) {
    const url = '/private/User/Get-all-users-by-filtering';
    const config = {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
    return axiosClient.get(url, config);
  },
  updateUser(params, token) {
    const url = `/private/User/${params.id}`;
    const config = {
      headers: {
        'Content-Type' : 'application/json-patch+json',
        'Authorization': `Bearer ${token}`,
      }
    }
    return axiosClient.patch(url, params.patchDoc, config);
  },
  getAllStudentsForAnalytics(params, token) {
    const url = '/private/User/Get-all-students-for-analytics';
    const config = {
        params,
        headers : {
            'Authorization' : `Bearer ${token}`,        
        } 
    }
    return axiosClient.get(url, config);
  },
  getAllExpertsForAnalytics(params, token) {
    const url = '/private/User/Get-all-experts-for-analytics';
    const config = {
        params,
        headers : {
            'Authorization' : `Bearer ${token}`,        
        } 
    }
    return axiosClient.get(url, config);
  },
  getExpertRevenueByID(params, token) {
    const url = `/private/User/Get-expert-revenue-by-id=${params.id}`;
    const config = {
        params,
        headers : {
            'Authorization' : `Bearer ${token}`,        
        } 
    }
    return axiosClient.get(url, config);
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
      params,
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return axiosClient.get(url, config);
  },
  getNewUsers(params, token) {
    const url = `/private/User/Get-new-users`;
    const config = {
      params,
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return axiosClient.get(url, config);
  },
  getAllExpertRequest (params,token) {
    const url = `private/User/Get-all-expert-requests`;
    const config = {
      params,
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return  axiosClient.get(url, config);
  },
  getBestStudents (params, token) {
    const url = 'private/User/Get-best-students';
    const config = {
      params,
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return  axiosClient.get(url, config);
  },
  getBestExperts (params, token) {
    const url = 'private/User/Get-best-experts';
    const config = {
      params,
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return  axiosClient.get(url, config);
  }
}

export default userAPI;