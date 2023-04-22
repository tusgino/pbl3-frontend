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
  }

}




export default lessonAPI;