import { setTextContent } from "../utils";
import courseAPI from "./courseAPI";
import userAPI from "./userAPI";
import systemAPI from "./system";

const token = localStorage.getItem('token');



const createRecord_Student= (data) => {
    if(!data) return;

    const studentRecord = document.getElementById('studentAnalyticsRecord');
    if(!studentRecord) return;

    const record = studentRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="username-studentanalytics"]', data.name);
    setTextContent(record, '[data-id="coursebuy-studentanalytics"]', data.numOfPurchasedCourse);
    setTextContent(record, '[data-id="coursefinish-studentanalytics"]', data.numOfFinishedCourse);


    return record;
}

const createRecord_Expert = (data) => {
    if(!data) return;
    
    console.log(data)
    const expertRecord = document.getElementById('expertAnalyticsRecord');
    if(!expertRecord) return;

    const record = expertRecord.content.cloneNode(true);
    if(!record) return;

    const currrentDate = new Date();

    setTextContent(record, '[data-id="username-expertanalytics"]', data.name);
    setTextContent(record, '[data-id="courseupload-expertanalytics"]', data.numOfUploadedCourse);
    setTextContent(record, '[data-id="revenue-expertanalytics"]', data.currentYearRevenue[currrentDate.getMonth() - 1]);

    
    const iconinfo = record.getElementById('expertanalytics-iconinfo');
    
    // const revenue = userAPI.getExpertRevenueByID(data.id);
    // console.log(revenue)
    
    iconinfo.addEventListener('click', async() => {
        var myChart = Chart.getChart('ExpertRevenueAnalytics');

        if(myChart != null) myChart.destroy();

        myChart = new Chart(document.getElementById('ExpertRevenueAnalytics'),
        {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [
                    {
                        label: "Doanh thu",
                        data: data.currentYearRevenue,
                        borderWidth: 1
                    },
                ]
            },
            options: {  
                scales: {
                    y: {
                    beginAtZero: true,
                    },
                },
                datasets : {
                    label: screenLeft,
                    screen : {
                        display : true,
                    }
                },
            }
        });  
        
        const toggleicon = document.getElementById('toggle-chart-expertanalytics');
        toggleicon.value = data.currentYearRevenue;
    })


    return record;
}

const createRecord_Course = (data) => {
    if(!data) return;

    const courseRecord = document.getElementById('courseAnalyticsRecord');
    if(!courseRecord) return;

    const record = courseRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="coursename-courseanalytics"]', data.course_name);
    setTextContent(record, '[data-id="regusercount-courseanalytics"]', data.num_of_reg);
    setTextContent(record, '[data-id="rate-courseanalytics"]', data.rate);


    return record;
} 

const getStudents = async(page) => {
    const params = {
        "_student_name_like" : document.getElementById('txtsearch-studentanalytics').value,
        "_start_purchase_course" : document.getElementById('txtcoursebuy-from').value,
        "_end_purchase_course" : document.getElementById('txtcoursebuy-to').value,
        "_start_finish_course" : document.getElementById('txtcoursefinish-from').value,
        "_end_finish_course" : document.getElementById('txtcoursefinish-to').value,
        "page" : page,
    };
    
    const dataview = document.querySelector('.thongkehocvien .data-view');
    dataview.textContent = "";

    const {data : {_data, _totalRows}} = await userAPI.getAllStudentsForAnalytics(params, token);

    console.log(_data);
    systemAPI.renderRecord(_data, 'thongkehocvien', createRecord_Student);
    systemAPI.renderPagination(_totalRows, 'thongkehocvien', getStudents, page);
}

const getExperts = async(page) => {
    const params = {
        "_expert_name_like" : document.getElementById('txtsearch-studentanalytics').value,
        "_start_upload_course" : document.getElementById('txtcourseupload-from').value,
        "_end_upload_course" : document.getElementById('txtcourseupload-to').value,
        "_start_revenue" : document.getElementById('txtrevenue-from').value,
        "_end_revenue" : document.getElementById('txtrevenue-to').value,
        "page" : page,
    };
    
    const dataview = document.querySelector('.thongkechuyengia .data-view');
    dataview.textContent = "";

    const {data : {_data, _totalRows}} = await userAPI.getAllExpertsForAnalytics(params, token);


    console.log(_data)
    systemAPI.renderRecord(_data, 'thongkechuyengia', createRecord_Expert);
    systemAPI.renderPagination(_totalRows, 'thongkechuyengia', getExperts, page);


}

const getCourses = async(page) => {
    const params = {
        "_title_like" : document.getElementById('txtsearch-courseanalytics').value,
        "_start_reg_user" : document.getElementById('txtstudentreg-from').value,
        "_end_reg_user" : document.getElementById('txtstudentreg-to').value,
        "_start_rate" : document.getElementById('rate-from').value,
        "_end_rate" : document.getElementById('rate-to').value,
        "page" : page,
    };
    
    const dataview = document.querySelector('.thongkekhoahoc .data-view');
    dataview.textContent = "";

    const {data : {_data, _totalRows}} = await courseAPI.getAllCoursesForAnalytics(params, token);


    console.log(_data)
    systemAPI.renderRecord(_data, 'thongkekhoahoc', createRecord_Course);
    systemAPI.renderPagination(_totalRows, 'thongkekhoahoc', getCourses, page);

}

const setEventSearch = () => {

    const btnsearchstudent = document.getElementById('btn-search-studentanalytics');
    const btnsearchexpert = document.getElementById('btn-search-expertanalytics');
    const btnsearchcourse = document.getElementById('btn-search-courseanalytics');

    btnsearchstudent.addEventListener('click', async() => {
        getStudents(1);
    })
    
    btnsearchexpert.addEventListener('click', async() => {
        getExperts(1);
    })

    btnsearchcourse.addEventListener('click', async() => {
        getCourses(1);
    })
}

export const setEventHandlerChart = (chartID, toggleID) => {

    const toggleicon = document.getElementById(`${toggleID}`);
    toggleicon.addEventListener('click', () => {
        var myChart = Chart.getChart(chartID);
        console.log(myChart);
        myChart.destroy();
        console.log(toggleicon.value)
        const config = {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [
                    {
                        label: "Doanh thu",
                        data: toggleicon.value,
                        borderWidth: 1
                    },
                ]
            },
            options: {  
                scales: {
                    y: {
                    beginAtZero: true,
                    },
                },
                datasets : {
                    label: screenLeft,
                    screen : {
                        display : true,
                    }
                },
            }
        };
        
        const iconchart = toggleicon.querySelector('i');

        if(iconchart.classList.contains('fa-chart-bar')) {
            config.type = 'bar';
            toggleicon.innerHTML = `<i class="fas fa-chart-line fa-lg"></i>`;
        } else if(iconchart.classList.contains('fa-chart-line')) {
            config.type = 'line';            
            toggleicon.innerHTML = `<i class="fas fa-chart-bar fa-lg"></i>`;
        }
        myChart = new Chart(document.getElementById(`${chartID}`), config);
    })
}

(async() => {    
    try {

        
        getStudents(1);
        
        getExperts(1);
        
        getCourses(1);
        
        setEventSearch();

        setEventHandlerChart('ExpertRevenueAnalytics', 'toggle-chart-expertanalytics');

    } catch (error) {
        console.log(error);
    }

})()