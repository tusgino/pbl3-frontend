import axiosClient from "./axiosClient";

const purchaseAPI = {

  purchaseStudent(data, token) {
    const url = '/Purchase/Purchase-a-course';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.post(url, data, config);
  }

};

export default purchaseAPI;