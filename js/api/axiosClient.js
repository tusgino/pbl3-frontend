import axios from "axios";

const axiosClient = axios.create({
  // baseURL: 'https://js-post-api.herokuapp.com/api',
  baseURL: 'https://localhost:7168/api',
  headers: {
    'Content-Type': 'application/json',
  }
});


// Handle before request, after response
// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log(config);
  // const accessToken = localStorage.getItem('access_token')
  // /public/posts
  // /private/posts

  // if (privateRequest && accessToken) {
  //   config.headers['Authorization'] = `Bearer ${accessToken}`
  // }


  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
}, function (error) {
  console.log('Interceptors error', error.response);
  if (!error.response) throw new Error('Network error. Please try again!');

  if (error.response.status === 401) {
    // clear token, logout
    // window.location.assign('/login.html');
    return;
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error); // return error to main
});

export default axiosClient
