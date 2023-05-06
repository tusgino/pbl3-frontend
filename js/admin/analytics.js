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
    setTextContent(record, '[data-id="revenue-expertanalytics"]', data.currentYearRevenue[currrentDate.getMonth()]);

    
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
                        label: "Doanh thu theo tháng",
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
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        });  
        
        const toggleicon = document.getElementById('toggle-chart-expertanalytics');
        toggleicon.value = data.currentYearRevenue;
        toggleicon.label = 'Doanh thu theo tháng';


        const revyear = document.querySelector('.thongkechuyengia .modal-body [data-id="revyear"]');
        const avgrev = document.querySelector('.thongkechuyengia .modal-body [data-id="avg-rev"]');
        const uploadcourse = document.querySelector('.thongkechuyengia .modal-body [data-id="uploadcourse"]');
        const bestsale = document.querySelector('.thongkechuyengia .modal-body [data-id="bestSales"]');
        const totalsales = document.querySelector('.thongkechuyengia .modal-body [data-id="totalsales"]');
        
        var revbyyear = 0;
        data.currentYearRevenue.forEach((amount) => {
            revbyyear += amount;
        })
        revyear.textContent = revbyyear + " VND";

        avgrev.textContent = Math.round(revbyyear/12) + " VND";

        uploadcourse.textContent = data.numOfUploadedCourse + " khoá";

        bestsale.textContent = data.bestSalesCourse;

        totalsales.textContent = data.totalSales;



    })


    return record;
}

const createRecord_Course = (data) => {
    if(!data) return;
    console.log(data)
    console.log(data.reg_users_by_month)

    const courseRecord = document.getElementById('courseAnalyticsRecord');
    if(!courseRecord) return;

    const record = courseRecord.content.cloneNode(true);
    if(!record) return;
    
    setTextContent(record, '[data-id="coursename-courseanalytics"]', data.course_name);
    setTextContent(record, '[data-id="regusercount-courseanalytics"]', data.total_reg);
    
    const stars = document.createElement('ul');
    stars.classList.add('hstack');
    for(var i = 0; i < data.rate; i++) {
        const star = document.createElement('li');
        star.innerHTML = `<i class="fas fa-star" style="color: #fff000;"></i>`;
        stars.appendChild(star);
    }
    for(var i = data.rate; i < 5; i++) {
        const fadestar = document.createElement('li');
        fadestar.innerHTML = `<i class="fas fa-star" style="color: #bfbfbf;"></i>`;
        stars.appendChild(fadestar);
    }
    const ratezone = record.querySelector('[data-id="rate-courseanalytics"]');
    ratezone.appendChild(stars);
    

    const iconinfo = record.getElementById('courseanalytics-iconinfo');
    
    iconinfo.addEventListener('click', async() => {
        var myChart = Chart.getChart('CourseAnalytics');

        if(myChart != null) myChart.destroy();

        myChart = new Chart(document.getElementById('CourseAnalytics'),
        {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [
                    {
                        label: "Số lượng",
                        data: data.reg_users_by_month,
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
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        });  
        
        const toggletypecharticon = document.getElementById('toggle-chart-courseanalytics');
        toggletypecharticon.value = data.reg_users_by_month;
        toggletypecharticon.label = 'Số lượng học viên theo tháng';
        const toggleobjecticon = document.getElementById('toggle-object-courseanalytics');
        toggleobjecticon.label1 = 'Số lượng học viên theo tháng';
        toggleobjecticon.data1 = data.reg_users_by_month;
        toggleobjecticon.label2 = 'Doanh thu theo tháng';
        toggleobjecticon.data2 = data.revenue_by_month;

        const totalreg = document.querySelector('.thongkekhoahoc .modal-body [data-id="total-reg"]');
        const avgreg = document.querySelector('.thongkekhoahoc .modal-body [data-id="avg-reg"]');
        const revyear = document.querySelector('.thongkekhoahoc .modal-body [data-id="revyear"]');
        const avgrev = document.querySelector('.thongkekhoahoc .modal-body [data-id="avg-rev"]');
        const rate = document.querySelector('.thongkekhoahoc .modal-body [data-id="rate"]');

        totalreg.textContent = data.total_reg + " học viên";

        var totalregyear = 0;
        data.reg_users_by_month.forEach((amount) => {
            totalregyear += amount;
        })
        const currentDate = new Date();
        console.log(totalregyear)
        console.log(currentDate.getMonth())
        avgreg.textContent = Math.round(totalregyear/(currentDate.getMonth() + 1)) + " học viên/tháng"
        
        var totalrevyear = 0;
        data.revenue_by_month.forEach((amount) => {
            totalrevyear += amount;
        })
        revyear.textContent = totalrevyear + " VND";

        avgrev.textContent = Math.round(totalrevyear/(currentDate.getMonth() + 1)) + " VND";

        rate.textContent = "";
        rate.appendChild(stars.cloneNode(true))
        
        
        
    })
    

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


    // sort by name
    // _data.sort((a,b) => { 
    //     if(a.name < b.name) return -1;
    //     else return 1;
    // })

    console.log(_data);
    systemAPI.renderRecord(_data, 'thongkehocvien', createRecord_Student);
    // systemAPI.renderPagination(_totalRows, 'thongkehocvien', getStudents, page);
    systemAPI.renderPaginationNew(_totalRows, 'thongkehocvien', getStudents, page);
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

    // sort by name
    // _data.sort((a,b) => { 
    //     if(a.name < b.name) return -1;
    //     else return 1;
    // })

    console.log(_data)
    systemAPI.renderRecord(_data, 'thongkechuyengia', createRecord_Expert);
    // systemAPI.renderPagination(_totalRows, 'thongkechuyengia', getExperts, page);
    systemAPI.renderPaginationNew(_totalRows, 'thongkechuyengia', getExperts, page);

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
    
    const {data : {_data, _totalRows}} = await courseAPI.getAllCoursesForAnalytics(params, token);

    //_data.sort(sortFunction)

    console.log(_data)
    systemAPI.renderRecord(_data, 'thongkekhoahoc', createRecord_Course);
    // systemAPI.renderPagination(_totalRows, 'thongkekhoahoc', getCourses, page);
    systemAPI.renderPaginationNew(_totalRows, 'thongkekhoahoc', getCourses, page);

}


const setEventSearch = () => {

    const btnsearchstudent = document.getElementById('btn-search-studentanalytics');
    btnsearchstudent.addEventListener('click', async() => {
        getStudents(1);
    })
    


    const btnsearchexpert = document.getElementById('btn-search-expertanalytics');
    btnsearchexpert.addEventListener('click', async() => {
        getExperts(1);
    })
    
    const btnsearchcourse = document.getElementById('btn-search-courseanalytics');
    // const btnsortname = document.getElementById('btn-sort-coursename-courseanalytics');
    // const btnsortreguser = document.getElementById('btn-sort-reguser-courseanalytics');
    // const btnsortrate = document.getElementById('btn-sort-rate-courseanalytics');

    btnsearchcourse.addEventListener('click', async() => {
        getCourses(1);
        // btnsortname.vaue = '1';
        // btnsortreguser.vaue = '0';
        // btnsortrate.value = '0';
    })
}

const sortCourses = {
    sortByName (a, b) {
        if(a.course_name < b.course_name) return -1;
        else return 1;
    },
    sortByNameDes(a, b) {
        if(a.course_name > b.course_name) return -1;
        else return 1;
    },
    sortByRegUser (a,b) {
        return a.total_reg - b.total_reg;
    },
    sortByRegUserDes (a,b) {
        return b.total_reg - a.total_reg;
    },
    sortByRate (a,b) {
        return a.rate - b.rate;
    },
    sortByRateDes (a,b) {
        return b.rate - a.rate;
    },
}

const setEventSort = async() => {

    // sort course
    { 
        const btnsortname = document.getElementById('btn-sort-coursename-courseanalytics');
        const btnsortreguser = document.getElementById('btn-sort-reguser-courseanalytics');
        const btnsortrate = document.getElementById('btn-sort-rate-courseanalytics');


        btnsortname.addEventListener('click', (event) => {        
            if(event.target.value == '1') {
                getCourses(1, sortCourses.sortByNameDes);
                event.target.value = '0';
            } else {
                getCourses(1, sortCourses.sortByName);
                event.target.value = '1'
            }
            btnsortreguser.value = '0';
            btnsortrate.value = '0';
        });

        btnsortreguser.addEventListener('click', (event) => {
            if(event.target.value == '1') {
                getCourses(1, sortCourses.sortByRegUserDes);
                event.target.value = '0';
            } else {
                getCourses(1, sortCourses.sortByRegUser);
                event.target.value = '1'
            }
            btnsortname.value = '0';
            btnsortrate.value = '0';
        });

        btnsortrate.addEventListener('click', (event) => {
            if(event.target.value == '1') {
                getCourses(1, sortCourses.sortByRateDes);
                event.target.value = '0';
            } else {
                getCourses(1, sortCourses.sortByRate);
                event.target.value = '1'
            }
            btnsortname.value = '0';
            btnsortreguser.value = '0';
        });
    }

}

const setSwapChart = async(chartID, toggleID) => {
    const toggleicon = document.getElementById(toggleID);
    toggleicon.addEventListener('click', () => {
        var myChart = Chart.getChart(chartID);
        console.log(myChart);
        myChart.destroy();

        const config = {
            type: 'bar',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [
                    {
                        label: toggleicon.label1,
                        data: toggleicon.data1,
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
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        };
        
        const iconchart = toggleicon.querySelector('i');

        const toggletypecharticon = document.getElementById('toggle-chart-courseanalytics')
        const icontype  = toggletypecharticon.querySelector('i');

        const title = document.querySelector('.thongkekhoahoc .modal-body .modal-title-2');
        if(iconchart.classList.contains('fa-user')) {
            config.data.datasets[0].data = toggleicon.data1;
            config.data.datasets[0].label = toggleicon.label1;
            toggleicon.innerHTML = `<i class="fas fa-money-check-alt fa-lg"></i>`;
            toggletypecharticon.value = toggleicon.data1;
            toggletypecharticon.label = 'Số lượng';
            title.textContent = toggleicon.label1;
        } else if(iconchart.classList.contains('fa-money-check-alt')) {
            config.data.datasets[0].data = toggleicon.data2;  
            config.data.datasets[0].lable = toggleicon.label2;        
            toggleicon.innerHTML = `<i class="fas fa-user fa-lg"></i>`;
            toggletypecharticon.value = toggleicon.data2;
            toggletypecharticon.label = 'Số lượng';
            title.textContent = toggleicon.label2;
        }
        if(icontype.classList.contains('fa-chart-bar')) {
            config.type = 'line';
        } else if(icontype.classList.contains('fa-chart-line')) {
            config.type = 'bar';
        }
        myChart = new Chart(document.getElementById(`${chartID}`), config);
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
                        label: toggleicon.label,
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
                plugins: {
                    legend: {
                        display: false,
                    }
                }
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

        //setEventSort();

        // setEventHandlerChart('ExpertRevenueAnalytics', 'toggle-chart-expertanalytics', 'Doanh thu theo tháng');


        setSwapChart('CourseAnalytics', 'toggle-object-courseanalytics');

        setEventHandlerChart('ExpertRevenueAnalytics', 'toggle-chart-expertanalytics');
        setEventHandlerChart('CourseAnalytics', 'toggle-chart-courseanalytics');

    } catch (error) {
        console.log(error);
    }

})()

export const ReloadAnalytics = () => {
    getStudents(1);
        
    getExperts(1);
    
    getCourses(1);
}