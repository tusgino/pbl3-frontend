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
  addExpertRequest (params, token) {
    const url = `private/ExpertRequest/Add-expert-request`;
    const config = {
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return axiosClient.post(url, params);
  },
  getAllExpertRequest (params,token) {
    const url = `private/ExpertRequest/Get-all-expertrequest`;
    const config = {
      headers : {
        'Authorization' : `Bearer ${token}`,
      },
    };
    return  axiosClient.get(url, params);
  },
  deleteExpertRequest(params, token) {
    const url = `private/ExpertRequest/Delete-expertrequest`;
    const config = {
      headers : {
          'Content-Type' : 'application/json-patch+json',
          // 'Accept' : 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      data : params,
    };
    return axiosClient.delete(url, config);
  },
  getRequestByID(params, token) {
    const url = `'private/ExpertRequest/Get-expertrequest-by-${params.id}`;
    const config = {
      headers : {
          'Content-Type' : 'application/json-patch+json',
          // 'Accept' : 'application/json',
          'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.get(url); 
  },
}

export default userAPI;