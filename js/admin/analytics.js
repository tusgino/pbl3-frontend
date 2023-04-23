import { setTextContent } from "../utils";
import courseAPI from "./courseAPI";
import userAPI from "./userAPI";
import tradeAPI from "./tradeAPI";
import systemAPI from "./system";

const token = localStorage.getItem('token');


const createRecord_Trade = (data) => {
    if(!data) return;

    const tradeRecord = document.getElementById('tradeAnalyticsRecord');
    if(!tradeRecord) return;

    const record = tradeRecord.content.cloneNode(true);
    if(!record) return;

    if(data.typeOfTrade == 0) setTextContent(record, '[data-id="typeoftrade-tradeanalytics"]', "Mua khoá học");
    else if(data.typeOfTrade == 1) setTextContent(record, '[data-id="typeoftrade-tradeanalytics"]', "Phí tài khoản");
    setTextContent(record, '[data-id="balance-tradeanalytics"]', data.balance);
    const dateoftrade = new Date(data.dateOfTrade);
    setTextContent(record, '[data-id="dateoftrade-tradeanalytics"]', dateoftrade.toLocaleDateString('en-GB',{ year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-'));
    setTextContent(record, '[data-id="tradestatus-tradeanalytics"]', data.tradeStatus);


    return record;

}

const createRecord_Student= (data) => {
    if(!data) return;

    const studentRecord = document.getElementById('studentAnalyticsRecord');
    if(!studentRecord) return;

    const record = studentRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="username-studentanalytics"]', data.student_name);
    setTextContent(record, '[data-id="coursebuy-studentanalytics"]', data.purchased_courses_count);
    setTextContent(record, '[data-id="coursefinish-studentanalytics"]', data.finished_courses_count);


    return record;
}

const createRecord_Expert = (data) => {
    if(!data) return;
    
    const expertRecord = document.getElementById('expertAnalyticsRecord');
    if(!expertRecord) return;

    const record = expertRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="username-expertanalytics"]', data._expert_name);
    setTextContent(record, '[data-id="courseupload-expertanalytics"]', data._numOfUploadCourse);
    setTextContent(record, '[data-id="revenue-expertanalytics"]', data._revenue);

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



const getTrade = async(page) => {
    const params = {
        "_is_purchase" : document.getElementById('btnchecktrue-tradetype1-analytics').checked,
        "_is_rent" : document.getElementById('btnchecktrue-tradetype2-analytics').checked,
        "_is_success" : document.getElementById('btnchecktrue-tradestatus-analytics').checked,
        "_is_pending" : document.getElementById('btncheckwait-tradestatus-analytics').checked,
        "_is_failed" : document.getElementById('btncheckfalse-tradestatus-analytics').checked,
        "_start_date" : document.getElementById('datetrade-from').value,    
        "_end_date" : document.getElementById('datetrade-to').value,
        "_start_balance" : document.getElementById('txtbalance-from').value,
        "_end_balance" : document.getElementById('txtbalance-to').value,
        "page" : page,
    };
    
    const dataview = document.querySelector('.thongkegiaodich .data-view');
    dataview.textContent = "";

    const {data : {_data, _totalRows}} = await tradeAPI.getAllTradeDetailByFiltering(params, token);

    console.log(_data);
    systemAPI.renderRecord(_data, 'thongkegiaodich', createRecord_Trade);
    systemAPI.renderPagination(_totalRows, 'thongkegiaodich', getTrade);


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
    systemAPI.renderPagination(_totalRows, 'thongkehocvien', getStudents);


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
    systemAPI.renderPagination(_totalRows, 'thongkechuyengia', getExperts);


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
    systemAPI.renderPagination(_totalRows, 'thongkekhoahoc', getCourses);

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

(async() => {    
    try {

        setEventSearch();

        getTrade(1);

        getStudents(1);
        
        getExperts(1);
        
        getCourses(1);


    } catch (error) {
        console.log(error);
    }

})()