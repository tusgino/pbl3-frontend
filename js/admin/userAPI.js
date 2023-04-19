import axiosClient from "../api/axiosClient";

const userAPI = {

  getAllUsersByFiltering(params) {
    const url = '/User/Get-all-users-by-filtering';
    const token = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJJRFVzZXIiOiIyMjM5ZjNiOS0wOWIwLTRiYjQtOTM4OC00MGU3YjMyMWQ2NDYiLCJOYW1lIjoiSHV5Vm8iLCJFbWFpbCI6Imh1eXljcCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiUm9sZSI6IkFkbWluIiwiZXhwIjoxNjgxOTgzMzc4fQ.WN01WofnPZIkVOdF2s1hx5WHTM9-TmobHgmqYLooRdN34C_XL-i4vogqnWlW3NSF-cJAPls8zdgqmlaQKboo3w'
    return axiosClient.get(url, {params },
    //   {
    //   headers: {
    //     'Content-Type' : 'application/json',
    //     'Accept' : 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   }
    // }
    );
  },
  
}

export default userAPI;