import { setTextContent, showModal } from "../utils";
import userAPI from "./userAPI";
import systemAPI from "./system";
import accountAPI from "../api/accountAPI";

const token = localStorage.getItem('token');

const createRecord = (data) => {
    if(!data) return;
    // console.log(data)   

    const userManageRecord = document.getElementById('userManageRecord')
    if(!userManageRecord) return;

    const record = userManageRecord.content.cloneNode(true);
    if(!record) return;

    const avatar = record.querySelector('.avatar');
    // console.log(avatar)
    avatar.src = data.avatar;

    const _datecreate = new Date(data.dateCreate);
    const datecreate = _datecreate.toLocaleDateString('en-GB',{ year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-');
    const _dateofbirth = new Date(data.dateOfBirth);
    const dateofbirth = _dateofbirth.toLocaleDateString('en-GB',{ year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-');

    

    setTextContent(record, '[data-id="userName"]', data.name);
    setTextContent(record, '[data-id="userType"]', data.typeOfUser);
    setTextContent(record, '[data-id="dateCreate"]', datecreate);
    setTextContent(record, '[data-id="userStatus"]', data.status);
    
    // const modalstudentinfo = document.getElementById('Modal-studentinfo');
    const detailuseravatar = document.getElementById('detail-userAvatar');
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
        detailuseravatar.src = data.avatar;
        detailusername.value = data.name;
        detailusertype.value = data.typeOfUser;
        if(dateofbirth == 'Invalid Date') detailuserdob.value = data.dateOfBirth;
        else detailuserdob.value = dateofbirth;
        detailuserpn.value = data.phoneNumber;
        detailuseridcard.value = data.idCard;
        detailuseremail.value = data.email;
        detailuserdatecreate.value = datecreate;
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
        if(await userAPI.updateUser(params, token)) alert("Cập nhật thành công");
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
        if(await userAPI.updateUser(params, token)) alert("Cập nhật thành công");
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
        if(await userAPI.updateUser(params, token)) alert("Cập nhật thành công");
        getUsers(1);
    })
    
}

// const avatarHandle = async() => {
//     document.getElementById('file-upload').addEventListener('change', function (event) {
//         var file = event.target.files[0];
//         var fileReader = new FileReader();

//         fileReader.onload = function (event) {
//             var imagePreview = document.getElementById('usermanager-addadmin').querySelector('.avatar');
//             // console.log(imagePreview)
//             imagePreview.src = event.target.result;
//         };

//         fileReader.readAsDataURL(file);
//     });

// }

const clearFormHandle = async() => {
    const btnclearform = document.getElementById('btn-clear-form');
    if(!btnclearform) return;

    const addadminform = document.getElementById('usermanager-addadmin');
    
    btnclearform.addEventListener('click', () => {
        // addadminform.querySelector('.avatar').src = "https://media.istockphoto.com/id/1307140502/vi/vec-to/vector-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-h%E1%BB%93-s%C6%A1-ng%C6%B0%E1%BB%9Di-d%C3%B9ng-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-ch%C3%A2n-dung-avatar-logo-k%C3%BD-t%C3%AAn-ng%C6%B0%E1%BB%9Di-h%C3%ACnh-d%E1%BA%A1ng.jpg?s=612x612&w=0&k=20&c=yCpEW0XGq3LCgCn-0GupWknu4pIYxEm8CigGHnqVkQU=";
        addadminform.querySelector('input[name="txt-admin-name"]').value = '';
        addadminform.querySelector('input[name="txt-admin-birth"]').value = '';
        addadminform.querySelector('input[name="txt-admin-phonenumber"]').value = '';
        addadminform.querySelector('input[name="txt-admin-email"]').value = '';
        // addadminform.querySelector('input[name="txt-admin-banknumber"]').value = '';
        // addadminform.querySelector('input[name="txt-admin-bankname"]').value = '';
        addadminform.querySelector('input[name="txt-admin-password"]').value = '';
        addadminform.querySelector('input[name="txt-admin-repassword"]').value = '';
        
    

    })


}

const addExpert = async(data) => {
    const btnsearch = document.getElementById('btn-search-addexpert');
    if(!btnsearch) return;


    const namefield = document.getElementById('namefield');
    const datefrom = document.getElementById('reg-date-from');
    const dateto = document.getElementById('reg-date-to');
    const nameexpert = document.getElementById('txtsearch-addexpert');
    btnsearch.addEventListener('click', () => {

    });


    const expertname = document.querySelector('[name="txt-expert-name"]');
    // const expertbirth = document.querySelector('[name="txt-expert-birth"]');
    // const expertpn = document.querySelector('[name="txt-expert-pn"]');
    // const expertidcard = document.querySelector('[name="txt-expert-idcard"]');
    const expertemail = document.querySelector('[name="txt-expert-email"]');
    // const expertdegree = document.querySelector('[name="txt-expert-degree"]');
    
    const btnaddexpert = document.getElementById('btn-add-expert');
    const btnrefusexpert = document.getElementById('btn-refuseexpert');

    btnaddexpert.addEventListener('click', () => {
        const params = {
            "Name" : expertname.value,
            "Email": expertemail.value,
            "TypeOfUser": 1,
        };


    })
    
    
    
    
    
}
    
const addAdmin = async() => {
    const btnaddadmin = document.getElementById('btn-add-admin');
    btnaddadmin.addEventListener('click', async () => {
        const addadminform = document.getElementById('usermanager-addadmin');
        // const avatar = addadminform.querySelector('input[name="file-upload  "]').value;
        const name = addadminform.querySelector('input[name="txt-admin-name"]').value;
        const email = addadminform.querySelector('input[name="txt-admin-email"]').value;
        const password = addadminform.querySelector('input[name="txt-admin-password"]').value;
        const repassword = addadminform.querySelector('input[name="txt-admin-repassword"]').value;

        if(name == '' || email == '' || password == '' || repassword == '') {
            alert("Thieu thong tin");
            return;
        }
        if(confirm('Xác nhận thêm?')) {

            try {
                const data = {
                    "name" : name,
                    "username" : email,
                    "password" : password, 
                    "repassword" : repassword, 
                    "typeOfUser" : 0, 
                }
                const res = await accountAPI.register(data);
                if(res.success) {
                    alert("Them admin thanh cong");
                }
                
            
            
            
            } catch (error) {
                //console.log(error);
                alert("Đã tồn tại");
            }



        }
    })



}

(async() => {    
    try {
        // avatarHandle();
        clearFormHandle();
        addAdmin();
        addExpert();

        setEventSearch();
        setEventHandlerAcc();

        getUsers(1);
        
    } catch (error) {
        console.log(error);
    }

})()