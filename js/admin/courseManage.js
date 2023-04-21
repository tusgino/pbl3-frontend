import { setTextContent } from "../utils";
import courseAPI from "./courseAPI";

const token = localStorage.getItem('token');

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

    renderRecord(_data);
    renderPagination(_totalRows);
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
        console.log(await courseAPI.updateCourse(params, token));
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
        await courseAPI.updateCourse(params, token);
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
        await courseAPI.updateCourse(params, token);
        getCourses(1);
    })

}

const createRecord = (data) => {
    if(!data) return;

    const courseManageRecord = document.getElementById('courseManageRecord');
    if(!courseManageRecord) return;

    const record = courseManageRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="courseName"]', data.name);
    setTextContent(record, '[data-id="category"]', data.category);
    setTextContent(record, '[data-id="dateUpload"]', data.dateUpload);
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



    const iconinfo = record.getElementById('coursemanage-iconinfo');

    iconinfo.addEventListener('click', () => {
        detailcoursename.value= data.name;
        detailcategory.value = data.category;
        detailcourseuploader.value = data.uploadUser;
        detailcoursedateupload.value = data.dateUpload;
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

    })
    // console.log(record);
    return record;

}

const renderRecord = (courseList) => {
    if(!Array.isArray(courseList) || courseList.length === 0) return;
    const dataview = document.querySelector(".quanlikhoahoc .data-view");
    // console.log(dataview)
    if(!dataview) return;

    courseList.forEach((course) => {
        const record = createRecord(course);
        if(record) {
            dataview.appendChild(record);
        }
    })

}

const createPage = (data) => {
    const liElement = document.createElement('li');
    liElement.classList.add("page-item");
    liElement.classList.add("btn");

    liElement.textContent = data;

    liElement.addEventListener('click', async() => {
        getCourses(data);
    })
    // console.log(liElement);
    return liElement;
}

const renderPagination = (totalRows) => {
    const ulElement = document.createElement('ul');
    ulElement.classList.add("pagination");
    ulElement.classList.add("justify-content-center");
    ulElement.classList.add("gap-2");
    const totalPage = Math.ceil(totalRows / 10);
    for(let i = 1; i <= totalPage; ++i) {
        ulElement.appendChild(createPage(i));
    }
    const dataview = document.querySelector(".quanlikhoahoc .data-view");
    dataview.appendChild(ulElement);
    // console.log(ulElement);
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