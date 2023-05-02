import axios from "axios";
import axiosClient from "../api/axiosClient";


const courseAPI = {

    getAllCoursesByFiltering(params, token) {
        const url = '/public/Course/Get-all-courses-by-filtering';
        const config = {
            params,
            headers : {
                'Authorization' : `Bearer ${token}`,        
            } 
        }
        return axiosClient.get(url, config);
    },
    updateCourse(params, token) {
        const url = `/public/Course/Update-course-by-${params.id}`;
        const config = {
          headers: {
            'Content-Type' : 'application/json-patch+json',
            'Authorization': `Bearer ${token}`,
          }
        }
        return axiosClient.patch(url, params.patchDoc, config);
    },
    getAllCoursesForAnalytics(params, token) {
        const url = '/public/Course/Get-all-courses-for-analytics';
        const config = {
            params,
            headers : {
                'Authorization' : `Bearer ${token}`,        
            } 
        }
        return axiosClient.get(url, config);
    },
    getAllCoursesByCategoryID (params, token) {
        const url = `/public/Course/Get-all-courses-by-categoryid${params.id}`;
        const config = {
            params,
            headers : {
                // 'Content-Type' : 'application/json',
                // 'Accept' : 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.get(url, config);
    },
    getAverageFeePercent(params, token) {
        const url = `/public/Course/Get-average-feepercent`;
        const config = {
            params,
            headers : {
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.get(url, config);
    },
    getBestCourses(params, token) {
        const url = `/public/Course/Get-best-courses`;
        const config = {
            params,
            headers : {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axiosClient.get(url, config);
    }
}

export default courseAPI;