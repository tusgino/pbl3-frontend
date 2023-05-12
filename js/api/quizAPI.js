import axiosClient from "./axiosClient";

const quizAPI = {

  addQuiz(data, token) {
    const url = '/Quiz/add-quiz';
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    return axiosClient.post(url, data, config);
  },
  updateQuiz(id, data, token) {
    const url = `/Quiz/Update/${id}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json',
      }
    };
    return axiosClient.patch(url, data, config);
  },
  deleteQuiz(id, token) {
    const url = `/Quiz/${id}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };
    return axiosClient.delete(url, config);
  }
}




export default quizAPI;