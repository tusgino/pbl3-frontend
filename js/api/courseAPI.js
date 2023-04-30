import axiosClient from "./axiosClient";

const courseAPI = {
  getAll(params) {
    const url = '/public/Course/Get-all-course-for';
    return axiosClient.get(url, { params });
  },
  getByID(params) {
    const url = '/public/Course/Get-course-by-IdCourse';
    return axiosClient.get(url, { params });
  },
  getByIDUser(params, token) {
    const url = '/public/Course/Get-all-course-by-Id';
    const config = {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.get(url, config);
  },
  addCourse(data, token) {
    const url = '/public/Course/Add-course';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.post(url, data, config);
  }
  // create(data) {
  //   const url = '/posts';
  //   return axiosClient.post(url, data);
  // },
  // update(data) {
  //   const url = `/posts/${data.id}`;
  //   return axiosClient.patch(url, data);
  // },
  // remove(id) {
  //   const url = `/posts/${id}`;
  //   return axiosClient.delete(url);
  // },
}



// const courseAPI = {
//   getAll(params) {
//     const url = '/posts';
//     return axiosClient.get(url, { params });
//   },
//   getByID(id) {
//     const url = `/posts/${id}`;
//     return axiosClient.get(url);
//   },
//   create(data) {
//     const url = '/posts';
//     return axiosClient.post(url, data);
//   },
//   update(data) {
//     const url = `/posts/${data.id}`;
//     return axiosClient.patch(url, data);
//   },
//   remove(id) {
//     const url = `/posts/${id}`;
//     return axiosClient.delete(url);
//   },
// }

export default courseAPI;