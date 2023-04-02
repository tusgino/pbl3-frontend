import axiosClient from "./axiosClient";

const courseAPI = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },
  getByID(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },
  create(data) {
    const url = '/posts';
    return axiosClient.post(url, data);
  },
  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },
  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
}

export default courseAPI;