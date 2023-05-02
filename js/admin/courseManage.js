import { setTextContent, showModal, showNotication } from "../utils";
import courseAPI from "./courseAPI";
import systemAPI from "./system";

const token = localStorage.getItem('token');

const createRecord = (data) => {
    if(!data) return;

    const courseManageRecord = document.getElementById('courseManageRecord');
    if(!courseManageRecord) return;

    const record = courseManageRecord.content.cloneNode(true);
    if(!record) return;


    const _dateupload = new Date(data.dateUpload);
    const dateupload = _dateupload.toLocaleDateString('en-GB',{ year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-');

    setTextContent(record, '[data-id="courseName"]', data.name);
    setTextContent(record, '[data-id="category"]', data.category);
    setTextContent(record, '[data-id="dateUpload"]', dateupload);
    setTextContent(record, '[data-id="courseStatus"]', data.status);


    const detailcoursename = document.getElementById('detail-courseName');
    const detailcategory = document.getElementById('detail-courseCategory');
    const detailcourseuploader = document.getElementById('detail-courseUploader');
    const detailcoursedateupload = document.getElementById('detail-courseDateUpload');
    const detailcourseprice = document.getElementById('detail-coursePrice');
    const detailcoursediscount = document.getElementById('detail-courseDiscount');
    const detailcoursefee = document.getElementById('detail-courseFee');
    const detailcoursestatus = document.getElementById('detail-courseStatus');
    const btnbancourse = document.getElementById('btn-bancourse');
    const btnunbancourse = document.getElementById('btn-unbancourse');
    const btndelcourse = document.getElementById('btn-delcourse');
    const btnsavecourse = document.getElementById('btn-save-course');

    const iconinfo = record.getElementById('coursemanage-iconinfo');

    iconinfo.addEventListener('click', () => {
        detailcoursename.value= data.name;
        detailcategory.value = data.category;
        detailcourseuploader.value = data.uploadUser;
        detailcoursedateupload.value = dateupload;
        detailcourseprice.value = data.price;
        detailcoursediscount.value = data.discount;
        detailcoursefee.value = data.feePercent;
        detailcoursestatus.value = data.status;
        if(data.status == "Hoạt động") {
            btnbancourse.style.display = "block";
            btnunbancourse.style.display = "none";
            btndelcourse.style.display = "none";
        } else if(data.status == "Lưu trữ") {
            btnbancourse.style.display = "none";
            btnunbancourse.style.display = "block";
            btndelcourse.style.display = "block";
        } else {
            btnbancourse.style.display = "none";
            btnunbancourse.style.display = "none";
            btndelcourse.style.display = "none";
        }
        console.log(data.id)
        btnbancourse.value = data.id;
        btnunbancourse.value = data.id;
        btndelcourse.value = data.id;
        btnsavecourse.value = data.id;

    })
    return record;
}


const getCourses = async(page) => {
    const params = {
        "_title_like" : document.getElementById('txtsearch-coursemanage').value,
        "_category_name" : document.getElementById('name-category').value,
        "_start_upload_day" : document.getElementById('dateupload-from').value, 
        "_end_upload_day" : document.getElementById('dateupload-to').value,
        "_status_active" : document.getElementById('btnchecktrue-coursestatus-manager').checked,
        "_status_store" : document.getElementById('btncheckfalse-coursestatus-manager').checked,
        "page" : page,
    };

    const dataview = document.querySelector('.quanlikhoahoc .data-view');
    dataview.textContent = "";

    const {data : {_data, _totalRows}} = await courseAPI.getAllCoursesByFiltering(params, token);

    systemAPI.renderRecord(_data, 'quanlikhoahoc', createRecord);
    systemAPI.renderPagination(_totalRows, 'quanlikhoahoc', getCourses, page);
}

const setEventSearch = () => {
    const btnsearch = document.getElementById('btn-search-coursemanage');
    btnsearch.addEventListener('click', async() => {
        getCourses(1);
    })
}

const setEventHandlerCourse = () => {
    const btnbancourse = document.getElementById('btn-bancourse');
    const btnunbancourse = document.getElementById('btn-unbancourse');
    const btndelcourse = document.getElementById('btn-delcourse');
    const btnsavecourse = document.getElementById('btn-save-course');

    btnbancourse.addEventListener('click', async(event) => {
        const patch = [{
            "operation": 1,
            "path": "/Status",
            "op": "replace",
            "value": 0,
        }];
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        };
        console.log(params)
        if(await courseAPI.updateCourse(params, token)) showNotication("Cập nhật thành công");
        getCourses(1);
    })
    btnunbancourse.addEventListener('click', async(event) => {
        const patch = [{
            "operation": 1,
            "path": "/Status",
            "op": "replace",
            "value": 1,
        }];
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        };
        if(await courseAPI.updateCourse(params, token)) showNotication("Cập nhật thành công");
        getCourses(1);
    })
    btndelcourse.addEventListener('click', async(event) => {
        const patch = [{
            "operation": 1,
            "path": "/Status",
            "op": "replace",
            "value": -1,
        }];
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        };
        if(await courseAPI.updateCourse(params, token)) showNotication("Cập nhật thành công");
        getCourses(1);
    });
    btnsavecourse.addEventListener('click', async(event) => {
        const courseFee = document.getElementById('detail-courseFee');
        const patch = [
            {
                "operation": 1,
                "path": "/FeePercent",
                "op": "replace",
                "value": courseFee.value,
            }
        ]
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        };
        if(await courseAPI.updateCourse(params, token)) showNotication("Cập nhật thành công");
        getCourses(1);
    })
}

(async() => {    
    try {

        setEventSearch();
        setEventHandlerCourse();
        getCourses(1);
        
    } catch (error) {
        console.log(error);
    }

})()