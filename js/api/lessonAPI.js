import axiosClient from "./axiosClient";

const lessonAPI = {

  getAllLesson(params, token) {
    const url = '/public/Course/Get-course-by-IdCourse-for-Student';
    const config = {
      params,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
    return axiosClient.get(url, config);
  },

  getLessonByID(idLesson, token) {
    const url = `/private/Lesson/${idLesson}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
    return axiosClient.get(url, config);
  },
  updateStatus(params, token) {
    const url = '/private/Lesson/change-status';
    console.log(params);
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json',
      },
    }
    return axiosClient.post(url, params, config);
  },
  addLesson(data, token) {
    const url = '/private/Lesson/add-lesson';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.post(url, data, config);
  },
  // updateQuiz(id, data, token) {
  //   const url = `/Quiz/Update/${id}`;
  //   const config = {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json-patch+json',
  //     }
  //   };
  //   return axiosClient.patch(url, data, config);
  // },
  // deleteQuiz(id, token) {
  //   const url = `/Quiz/${id}`;
  //   const config = {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //     }
  //   };
  //   return axiosClient.delete(url, config);
  // }

}




export default lessonAPI;