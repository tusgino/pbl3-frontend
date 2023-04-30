import axios from "axios";
import axiosClient from "../api/axiosClient";


const courseAPI = {

    getAllCoursesByFiltering(params, token) {
        const url = '/public/Course/Get-all-courses-by-filtering';
        const config = {
            headers : {
                'Authorization' : `Bearer ${token}`,        
            } 
        }
        return axiosClient.get(url, {params});
    },
    updateCourse(params, token) {
        const url = `/public/Course/Update-course-by-${params.id}`;
        const config = {
          headers: {
            'Content-Type' : 'application/json-patch+json',
            // 'Authorization': `Bearer ${token}`,
          }
        }
        return axiosClient.patch(url, params.patchDoc, config);
    },
    getAllCoursesForAnalytics(params, token) {
        const url = '/public/Course/Get-all-courses-for-analytics';
        const config = {
            headers : {
                'Authorization' : `Bearer ${token}`,        
            } 
        }
        return axiosClient.get(url, {params});
    },
    getAllCoursesByCategoryID (params, token) {
        const url = `/public/Course/Get-all-courses-by-categoryid${params.id}`;
        const config = {
            headers : {
                // 'Content-Type' : 'application/json',
                // 'Accept' : 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.get(url, {params});
    },
    getAverageFeePercent(params, token) {
        const url = `/public/Course/Get-average-feepercent`;
        const config = {
            headers : {
                'Authorization': `Bearer ${token}`,
            }
        }
        return axiosClient.get(url);
    },
    getBestCourses(params, token) {
        const url = `/public/Course/Get-best-courses`;
        const config = {
            headers : {
                'Authorization': `Bearer ${token}`,
            },
        };
        return axiosClient.get(url);
    }
}

export default courseAPI;