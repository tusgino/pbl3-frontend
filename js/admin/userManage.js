import { setTextContent } from "../utils";
import userAPI from "./userAPI";
import systemAPI from "./system";

const token = localStorage.getItem('token');

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
    const btnunbanacc = document.getElementById('btn-unbanacc');
    const btndelacc= document.getElementById('btn-delacc');


    //const detailstudentinfo = document.getElementById("Modal-studentinfo")
    // console.log(detailstudentinfo)
    const iconinfo = record.getElementById('usermanage-iconinfo');
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
        console.log(data);   
        
        btnbanacc.value = data.id;
        btnunbanacc.value = data.id;
        btndelacc.value = data.id;
    })
    
    
    return record;
}


const getUsers = async(page) => {
    const params = {
        "_title_like" : document.getElementById('txtsearch-usermanage').value,
        "_is_student" : document.getElementById("btncheckstudent").checked, 
        "_is_expert" : document.getElementById('btncheckexpert').checked,
        "_is_admin" : document.getElementById('btncheckadmin').checked,
        "_start_date_create" : document.getElementById('datecreate-from').value,
        "_end_date_create" : document.getElementById('datecreate-to').value,
        "_status_active" : document.getElementById('btncheckactive').checked, 
        "_status_banned" : document.getElementById('btncheckbanned').checked,
        "page" : page,
    };

    const dataview = document.querySelector(".quanlinguoidung .data-view");
    dataview.textContent = "";

    const {data : {_data, _totalRows}} = await userAPI.getAllUsersByFiltering(params, token);
    
    systemAPI.renderRecord(_data, 'quanlinguoidung', createRecord);
    systemAPI.renderPagination(_totalRows, 'quanlinguoidung', getUsers);
}


const setEventSearch = () => {
    const btnsearch = document.getElementById('btn-search-usermanage');
    btnsearch.addEventListener('click', async() => {
        getUsers(1);
    })

}

const setEventHandlerAcc = () => {
    const btnbanacc = document.getElementById('btn-banacc');
    const btnunbanacc = document.getElementById('btn-unbanacc');
    const btndelacc= document.getElementById('btn-delacc');

    btnbanacc.addEventListener('click', async(event) => {
        const patch = [{
            "operationType": 1,
            "path": "/Status",
            "op": "replace",
            "value": 0,
        }];
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        }
        await userAPI.updateUser(params, token);
        getUsers(1);
    })
    btnunbanacc.addEventListener('click', async(event) => {
        const patch = [{
            "operationType": 1,
            "path": "/Status",
            "op": "replace",
            "value": 1,
        }];
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        }
        await userAPI.updateUser(params, token);
        getUsers(1);
    })
    btndelacc.addEventListener('click', async(event) => {
        const patch = [{
            "operationType": 1,
            "path": "/Status",
            "op": "replace",
            "value": -1,
        }];
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        }
        await userAPI.updateUser(params, token);
        getUsers(1);
    })
    
}

const avatarHandle = async() => {
    document.getElementById('file-upload').addEventListener('change', function (event) {
        var file = event.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = function (event) {
            var imagePreview = document.getElementById('usermanager-addadmin').querySelector('.avatar');
            // console.log(imagePreview)
            imagePreview.src = event.target.result;
        };

        fileReader.readAsDataURL(file);
    });
   

}

const clearFormHandle = async() => {
    const btnclearform = document.getElementById('btn-clear-form');
    if(!btnclearform) return;

    const addadminform = document.getElementById('usermanager-addadmin');
    
    btnclearform.addEventListener('click', () => {
        addadminform.querySelector('.avatar').src = "https://media.istockphoto.com/id/474001892/photo/a-icon-of-a-businessman-avatar-or-profile-pic.jpg?b=1&s=170667a&w=0&k=20&c=trV5fWB-V__5-cM1ipDyOaQ6Sng1rj74qMuOQSt4sug=";
        addadminform.querySelector('input[name="txt-admin-name"]').value = null;
        addadminform.querySelector('input[name="txt-admin-birth"]').value = null;
        addadminform.querySelector('input[name="txt-admin-phonenumber"]').value = null;
        addadminform.querySelector('input[name="txt-admin-idcard"]').value = null;
        addadminform.querySelector('input[name="txt-admin-email"]').value = null;
        addadminform.querySelector('input[name="txt-admin-banknumber"]').value = null;
        addadminform.querySelector('input[name="txt-admin-bankname"]').value = null;
        addadminform.querySelector('input[name="txt-admin-password"]').value = null;
    
    

    })


}

const addAdmin = async() => {
    
}

(async() => {    
    try {
        avatarHandle();
        clearFormHandle();


        setEventSearch();
        setEventHandlerAcc();

        getUsers(1);
        
    } catch (error) {
        console.log(error);
    }

})()