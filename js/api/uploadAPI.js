import axiosClient from "./axiosClient";

export const uploadAPI = {
  uploadImage(formData, token) {
    const url = `/Upload/upload`;
    return axiosClient.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
  },
}

export default uploadAPI;