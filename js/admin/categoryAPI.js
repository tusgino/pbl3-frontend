import axios from "axios";
import axiosClient from "../api/axiosClient";


const categoryAPI = {
    addCategory (params, token) {
        const url = '/private/Category/add-category';
        const config = {
            headers : {
                // 'Content-Type' : 'application/json',
                // 'Accept' : 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.post(url, {params});
    },
    getAllCategory(params, token) {
        const url = '/private/Category/get-all-categories';
        const config = {
            headers : {
                // 'Content-Type' : 'application/json',
                // 'Accept' : 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.get(url, {params});
    },
    deleteCategories (params, token) {
        const url = '/private/Category/delete-categories';
        const config = {
            headers : {
                // 'Content-Type' : 'application/json',
                // 'Accept' : 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.delete(url, {params});
    },


}

export default categoryAPI;