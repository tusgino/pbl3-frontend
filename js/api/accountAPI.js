import axiosClient from "./axiosClient";

const courseAPI = {
  // getAll(params) {
  //   const url = '/posts';
  //   return axiosClient.get(url, { params });
  // },
  getByID(params) {
    const url = '/public/Account/id';
    return axiosClient.get(url, { params });
  },
  register(data) {
    const url = '/public/Account/Register';
    return axiosClient.post(url, data);
  },
  login(data) {
    const url = '/public/Account/Login';
    return axiosClient.post(url, data);
  },
  // update(data) {
  //   const url = `/posts/${data.id}`;
  //   return axiosClient.patch(url, data);
  // },
  // remove(id) {
  //   const url = `/posts/${id}`;
  //   return axiosClient.delete(url);
  // },
}

export default courseAPI;