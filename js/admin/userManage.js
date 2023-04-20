import { setTextContent } from "../utils";
import userAPI from "./userAPI";

const token = localStorage.getItem('token');

const setEventSearch = () => {
    const btnsearch = document.getElementById('btn-search-usermanage');
    btnsearch.addEventListener('click', async() => {
        const params = {
            "_title_like" : document.getElementById('txtsearch-usermanage').value,
            "_is_student" : document.getElementById("btncheckstudent").checked, 
            "_is_expert" : document.getElementById('btncheckexpert').checked,
            "_is_admin" : document.getElementById('btncheckadmin').checked,
            "_start_date_create" : document.getElementById('datecreate-from').value,
            "_end_date_create" : document.getElementById('datecreate-to').value,
            "_status_active" : document.getElementById('btncheckactive').checked, 
            "_status_banned" : document.getElementById('btncheckbanned').checked,
            "page" : 1,
        };
        // console.log(params);
        const dataview = document.querySelector(".quanlinguoidung .data-view");
        
        // console.log(dataview);
        dataview.textContent = "";
        const { data : { _data , _totalRows }} = await userAPI.getAllUsersByFiltering(params, token);
        
        renderRecord(_data);
        renderPagination(_totalRows);
    })

}

const createRecord = (data) => {
    if(!data) return;

    const userManageRecord = document.getElementById('userManageRecord')
    if(!userManageRecord) return;

    const record = userManageRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="userName"]', data.name);
    setTextContent(record, '[data-id="userType"]', data.typeOfUser);
    setTextContent(record, '[data-id="dateCreate"]', data.dateCreate);
    setTextContent(record, '[data-id="userStatus"]', data.status);
    
    // const modalstudentinfo = document.getElementById('Modal-studentinfo');
    const detailusername = document.getElementById('detail-userName');
    const detailusertype = document.getElementById('detail-userType');
    const detailuserdob = document.getElementById('detail-userdob');
    const detailuserpn = document.getElementById('detail-userpn');
    const detailuseridcard = document.getElementById('detail-useridcard');
    const detailuseremail = document.getElementById('detail-useremail');
    const detailuserdatecreate = document.getElementById('detail-userdatecreate');
    const detailuserstatus = document.getElementById('detail-userstatus');
    const btnbanacc = document.getElementById('btn-banacc');
    const btndelacc= document.getElementById('btn-delacc');
    const btnunbanacc = document.getElementById('btn-unbanacc');


    //const detailstudentinfo = document.getElementById("Modal-studentinfo")
    // console.log(detailstudentinfo)
    const iconinfo = record.getElementById('iconinfo');
    // console.log(iconinfo);
    iconinfo.addEventListener('click', () => {
        detailusername.value = data.name;
        detailusertype.value = data.typeOfUser;
        detailuserdob.value = data.dateOfBirth;
        detailuserpn.value = data.phoneNumber;
        detailuseridcard.value = data.idCard;
        detailuseremail.value = data.email;
        detailuserdatecreate.value = data.dateCreate;
        detailuserstatus.value = data.status;
        if(data.typeOfUser == "Admin" || data.status == "Cấm vĩnh viễn") {
            btnbanacc.style.display = "none";
            btndelacc.style.display = "none";
            btnunbanacc.style.display = "none";
        } else if(data.status == "Hoạt động") {
            btnbanacc.style.display = "block";
            btndelacc.style.display = "none";
            btnunbanacc.style.display = "none";
        } else {
            btnunbanacc.style.display = "block";
            btndelacc.style.display = "block";
            btnbanacc.style.display = "none";
        }
        
    })

    btnbanacc.addEventListener('click', async() => {
        const params = {
            userid : data.iD,
            change : {
                "operationType": 1,
                "path": "/Status",
                "op": "replace",
                "value": 0,
            }
        }
        console.log(await userAPI.updateUser(params, token));
    })
    btnunbanacc.addEventListener('click', async() => {
        const params = {
            userid : data.iD,
            change : {
                "operationType": 1,
                "path": "/Status",
                "op": "replace",
                "value": 1,
            }
        }
        console.log(await userAPI.updateUser(params, token));
    })
    btndelacc.addEventListener('click', async() => {
        const params = {
            userid : data.iD,
            change : {
                "operationType": 1,
                "path": "/Status",
                "op": "replace",
                "value": -1,
            }
        }
        console.log(await userAPI.updateUser(params, token));
        
    })
    
    return record;
}

const renderRecord = (userList) => {
    
    if(!Array.isArray(userList) || userList.length === 0) return;
    const dataview = document.querySelector(".quanlinguoidung .data-view");
    // console.log(dataview);
    if(!dataview) return;
    userList.forEach((user) => {
        const record = createRecord(user);
        if(record) {
            dataview.appendChild(record);
        }
    });
}

const createPage = (data) => {
    const liElement = document.createElement('li');
    liElement.classList.add("page-item");
    liElement.classList.add("btn");

    liElement.textContent = data;

    liElement.addEventListener('click', async() => {
        const params = {
            "_title_like" : document.getElementById('txtsearch-usermanage').value,
            "_is_student" : document.getElementById("btncheckstudent").checked, 
            "_is_expert" : document.getElementById('btncheckexpert').checked,
            "_is_admin" : document.getElementById('btncheckadmin').checked,
            "_start_date_create" : document.getElementById('datecreate-from').value,
            "_end_date_create" : document.getElementById('datecreate-to').value,
            "_status_active" : document.getElementById('btncheckactive').checked, 
            "_status_banned" : document.getElementById('btncheckbanned').checked,
            "page" : data,
        };
        // console.log(params);
        const dataview = document.querySelector(".quanlinguoidung .data-view");
        
        // console.log(dataview);
        dataview.textContent = "";
        const { data : { _data , _totalRows }} = await userAPI.getAllUsersByFiltering(params, token);

        renderRecord(_data);
        renderPagination(_totalRows);
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
    const dataview = document.querySelector(".quanlinguoidung .data-view");
    dataview.appendChild(ulElement);
    // console.log(ulElement);
} 

(async() => {    
    try {

        setEventSearch();

        const params = {
            "_title_like" : document.getElementById('txtsearch-usermanage').value,
            "_is_student" : document.getElementById("btncheckstudent").checked, 
            "_is_expert" : document.getElementById('btncheckexpert').checked,
            "_is_admin" : document.getElementById('btncheckadmin').checked,
            "_start_date_create" : document.getElementById('datecreate-from').value,
            "_end_date_create" : document.getElementById('datecreate-to').value,
            "_status_active" : document.getElementById('btncheckactive').checked, 
            "_status_banned" : document.getElementById('btncheckbanned').checked,
            "page" : 1,
        };
        // console.log(params)
        const { data : { _data , _totalRows }} = await userAPI.getAllUsersByFiltering(params, token);
        // console.log(res.data);
         
        renderRecord(_data);
        console.log(_data);
        renderPagination(_totalRows);
        console.log(_totalRows);

    } catch (error) {
        console.log(error);
    }

})()