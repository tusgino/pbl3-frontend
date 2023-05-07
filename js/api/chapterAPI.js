import axiosClient from "./axiosClient";

const chapterAPI = {

  addChapter(data, token) {
    const url = '/Chapter/AddChapter';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.post(url, data, config);
  },
  updateChapter(id, data, token) {
    const url = `/Chapter/Update/${id}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json',
      }
    };
    return axiosClient.patch(url, data, config);
  },
  deleteChapter(id, token) {
    const url = `/Chapter/${id}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };
    return axiosClient.delete(url, config);
  }
}




export default chapterAPI;