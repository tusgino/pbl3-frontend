import axios from "axios";
import axiosClient from "../api/axiosClient";


const categoryAPI = {
    addCategory (params, token) {
        const url = `/private/Category/Add-category?_category_name=${params._category_name}`;
        const config = {
            headers : {
                // 'Content-Type' : 'application/json',
                // 'Accept' : 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.post(url, params);
    },
    getAllCategory(params, token) {
        const url = '/private/Category/Get-all-categories';
        const config = {
            headers : {
                // 'Content-Type' : 'application/json',
                // 'Accept' : 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.get(url, {params});
    },
    updateCategory(params, token) {
        const url = `/private/Category/Update-category-by-${params.id}`;
        const config = {
          headers: {
            'Content-Type' : 'application/json-patch+json',
            // 'Authorization': `Bearer ${token}`,
          }
        }
        return axiosClient.patch(url, params.patchDoc, config);
    },
    deleteCategories (params, token) {
        const url = '/private/Category/Delete-categories';
        const config = {
            headers : {
                'Content-Type' : 'application/json-patch+json',
                // 'Accept' : 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            data : params,
        }
        return axiosClient.delete(url, config);
    },

}

export default categoryAPI;