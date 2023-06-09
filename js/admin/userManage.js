import { setTextContent, showModal, showNotication } from "../utils";
import userAPI from "./userAPI";
import systemAPI from "./system";
import accountAPI from "../api/accountAPI";
import expertAPI from "../api/expertAPI";
import { ReloadOverview } from "./overview";

const token = localStorage.getItem('token');

const createRecord = (data) => {
    if(!data) return;

    const userManageRecord = document.getElementById('userManageRecord')
    if (!userManageRecord) return;

    const record = userManageRecord.content.cloneNode(true);
    if (!record) return;

    const avatar = record.querySelector('.avatar');
    avatar.src = data.avatar;

    const _datecreate = new Date(data.dateCreate);
    const datecreate = _datecreate.toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-');
    const _dateofbirth = new Date(data.dateOfBirth);
    const dateofbirth = _dateofbirth.toLocaleDateString('en-GB', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-');

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
    const btndelacc = document.getElementById('btn-delacc');

    const iconinfo = record.getElementById('usermanage-iconinfo');

    iconinfo.addEventListener('click', () => {
        detailuseravatar.src = data.avatar;
        detailusername.value = data.name;
        detailusertype.value = data.typeOfUser;
        if (dateofbirth == 'Invalid Date') detailuserdob.value = data.dateOfBirth;
        else detailuserdob.value = dateofbirth;
        detailuserpn.value = data.phoneNumber;
        detailuseridcard.value = data.idCard;
        detailuseremail.value = data.email;
        detailuserdatecreate.value = datecreate;
        detailuserstatus.value = data.status;
        if (data.typeOfUser == "Admin" || data.status == "Cấm vĩnh viễn") {
            btnbanacc.style.display = "none";
            btndelacc.style.display = "none";
            btnunbanacc.style.display = "none";
        } else if (data.status == "Hoạt động") {
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

const getUsers = async (page) => {
    const params = {

        "title_like" : document.getElementById('txtsearch-usermanage').value,
        "start_date_create" : document.getElementById('datecreate-from').value,
        "end_date_create" : document.getElementById('datecreate-to').value,
        "status_active" : document.getElementById('btncheckactive').checked, 
        "status_banned" : document.getElementById('btncheckbanned').checked,
        "is_student" : document.getElementById("btncheckstudent").checked, 
        "is_expert" : document.getElementById('btncheckexpert').checked,
        "is_admin" : document.getElementById('btncheckadmin').checked,
        "page" : page,

    };

    const {data : {_data, _totalRows}} = await userAPI.getAllUsersByFiltering(params, token);

    systemAPI.renderRecord(_data, 'quanlinguoidung', createRecord);
    systemAPI.renderPagination(_totalRows, 'quanlinguoidung', getUsers, page);
}

const setEventSearch = () => {
    const btnsearch = document.getElementById('btn-search-usermanage');
    btnsearch.addEventListener('click', async () => {
        getUsers(1);
    })
    const btnsearchex = document.getElementById('btn-search-addexpert');
    btnsearchex.addEventListener('click', () => {
        getExpertRequest(1);
    })
}

const setEventHandlerAcc = () => {
    const btnbanacc = document.getElementById('btn-banacc');
    const btnunbanacc = document.getElementById('btn-unbanacc');
    const btndelacc = document.getElementById('btn-delacc');

    btnbanacc.addEventListener('click', async (event) => {
        const patch = [{
            "operationType": 1,
            "path": "/Status",
            "op": "replace",
            "value": 0,
        }];
        const params = {
            id: event.target.value,
            patchDoc: JSON.stringify(patch),
        }
        if (await userAPI.updateUser(params, token)) showNotication("Cập nhật thành công");
        getUsers(1);
    })
    btnunbanacc.addEventListener('click', async (event) => {
        const patch = [{
            "operationType": 1,
            "path": "/Status",
            "op": "replace",
            "value": 1,
        }];
        const params = {
            id: event.target.value,
            patchDoc: JSON.stringify(patch),
        }
        if (await userAPI.updateUser(params, token)) showNotication("Cập nhật thành công");
        getUsers(1);
    })
    btndelacc.addEventListener('click', async (event) => {
        const patch = [{
            "operationType": 1,
            "path": "/Status",
            "op": "replace",
            "value": -1,
        }];
        const params = {
            id: event.target.value,
            patchDoc: JSON.stringify(patch),
        }
        if (await userAPI.updateUser(params, token)) showNotication("Cập nhật thành công");
        getUsers(1);
    })

}

const clearFormHandle = async () => {
    const btnclearform = document.getElementById('btn-clear-form');
    if (!btnclearform) return;

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

const handleDegreeChange = async () => {
    const selector = document.querySelector('[name="txt-expert-degree"]');
    if (!selector) return;

    const degreeimage = document.getElementById('degree-image');
    const degreedesc = document.getElementById('degree-desc');

    selector.addEventListener('change', async() => {

        const degreeid = selector.options[selector.selectedIndex].value;
        const degree = await expertAPI.getDegreeByIDDgree(degreeid, token);
        degreeimage.src = degree.data.image;
        degreedesc.textContent = degree.data.description;
    });
}

const createExpertRequestRecord = (data) => {
    if(!data) return;

    // add request vao trong view 
    const addExpertRecord = document.getElementById('addExpertRequest');
    if (!addExpertRecord) return;

    const record = addExpertRecord.content.cloneNode(true);
    if (!record) return;


    setTextContent(record, '[data-id="expertName"]', data.name);

    const dateCreate = new Date(data.dateCreate);
    setTextContent(record, '[data-id="requestDate"]', dateCreate.toLocaleDateString('en-GB',{ year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '-'));

    //

    const expertavatar = document.querySelector('[name="txt-expert-avatar"]');
    const expertname = document.querySelector('[name="txt-expert-name"]');
    const expertdob = document.querySelector('[name="txt-expert-birth"]');
    const expertphone = document.querySelector('[name="txt-expert-pn"]');
    const expertidcard = document.querySelector('[name="txt-expert-idcard"]');
    const expertemail = document.querySelector('[name="txt-expert-email"]');
    const expertbanknumber = document.querySelector('[name="txt-expert-banknumber"]');
    const expertbankname = document.querySelector('[name="txt-expert-bankname"]');
    const expertdegree = document.querySelector('[name="txt-expert-degree"]');
    const degreeimage = document.getElementById('degree-image');
    const degreedesc = document.getElementById('degree-desc');

    const btninfo = record.querySelector('div');

    const btnaddexpert = document.getElementById('btn-add-expert');
    const btnrefuseexpet = document.getElementById('btn-refuseexpert');
    const defaultoption = document.createElement('option');
    defaultoption.value = 'default';
    defaultoption.textContent = " - Chọn bằng cấp - ";

    btninfo.addEventListener('click', () => {
        expertavatar.src = data.avatar;
        expertname.value = data.name;
        expertdob.value = data.dateOfBirth;
        expertphone.value = data.phoneNumber;
        expertidcard.value = data.idCard;
        expertemail.value = data.email;
        expertbanknumber.value = data.bankNumber;
        expertbankname.value = data.bankName;
        expertdegree.textContent = "";
        expertdegree.appendChild(defaultoption);
        degreeimage.src = "https://plus.unsplash.com/premium_photo-1677474826931-eb70ec714d99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";
        degreedesc.textContent = "";
        data.degrees.forEach((element) => {
            const option = document.createElement('option');
            option.textContent = element.name;
            option.value = element.idDegree;
            expertdegree.appendChild(option);
        });   
        console.log(data);

        btnaddexpert.value = data.idUser;
        btnrefuseexpet.value = data.idUser;
    })
    return record;
}

const handleExpertRequest = async () => {
    const btnaddexpert = document.getElementById('btn-add-expert');
    const btnrefuseexpert = document.getElementById('btn-refuseexpert');

    btnaddexpert.addEventListener('click', async (event) => {
        const patch = [{
            "operationType": 1,
            "path": "/Status",
            "op": "replace",
            "value": 1,
        }];
        const params = {
            id: event.target.value,
            patchDoc: JSON.stringify(patch),
        }
        if (await userAPI.updateUser(params, token)) {
            const data = {
                idUser: event.target.value,
                subject: "Thông báo từ THH Online Course",
                body: `<!DOCTYPE html>
                        <html>

                        <head>
                        <meta charset="UTF-8">
                        <title>Confirmation Email</title>
                        <style>
                            /* CSS styles */
                            body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            padding: 20px;
                            }

                            .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }

                            .header {
                            text-align: center;
                            margin-bottom: 20px;
                            color: #5271ff;
                            }

                            .content {
                            line-height: 1.6;
                            text-align: center;
                            }
                        </style>
                        </head>

                        <body>
                        <div class="container">
                            <div class="header">
                            <h1>Email thông báo</h1>
                            </div>
                            <div class="content">
                            <p>Tài khoản của bạn đã được xác nhận thành công</p>
                            </div>
                        </div>
                        </body>

                        </html>
                        `,
            }
            userAPI.sendMail(data, token);
            showNotication("Thêm thành công");
        }
        getExpertRequest(1);
        ReloadOverview();
    })

    btnrefuseexpert.addEventListener('click', async (event) => {
        const patch = [{
            "operationType": 1,
            "path": "/Status",
            "op": "replace",
            "value": -1,
        }];
        const params = {
            id: event.target.value,
            patchDoc: JSON.stringify(patch),
        }
        if (await userAPI.updateUser(params, token)) {
            const data = {
                idUser: event.target.value,
                subject: "Thông báo từ THH Online Course",
                body: `<!DOCTYPE html>
                        <html>

                        <head>
                        <meta charset="UTF-8">
                        <title>Confirmation Email</title>
                        <style>
                            /* CSS styles */
                            body {
                            font-family: Arial, sans-serif;
                            background-color: #f5f5f5;
                            padding: 20px;
                            }

                            .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }

                            .header {
                            text-align: center;
                            margin-bottom: 20px;
                            color: #ff0000;
                            }

                            .content {
                            line-height: 1.6;
                            text-align: center;
                            }
                        </style>
                        </head>

                        <body>
                        <div class="container">
                            <div class="header">
                            <h1>Email thông báo</h1>
                            </div>
                            <div class="content">
                            <p>Tài khoản của bạn đã không hợp lệ!</p>
                            </div>
                        </div>
                        </body>

                        </html>
                        `,
            }
            userAPI.sendMail(data, token);
            showNotication("Từ chối thành công");
        }
        getExpertRequest(1);
        ReloadOverview();
    })
}

const getExpertRequest = async (page) => {
    const params = {
        "name" : document.getElementById('txtsearch-addexpert').value,
        "date_create_from" : document.getElementById('req-date-from').value,
        "date_create_to" : document.getElementById('req-date-to').value,
        "page" : page, 
    }

    const {data : {_data, _totalRows}} = await userAPI.getAllExpertRequest(params, token);

    systemAPI.renderRecord(_data, 'formthemexpert', createExpertRequestRecord);
    systemAPI.renderPagination(_totalRows, 'formthemexpert', getExpertRequest, page);
}

const addAdmin = async () => {
    const btnaddadmin = document.getElementById('btn-add-admin');
    btnaddadmin.addEventListener('click', async () => {
        const addadminform = document.getElementById('usermanager-addadmin');
        // const avatar = addadminform.querySelector('input[name="file-upload  "]').value;
        const name = addadminform.querySelector('input[name="txt-admin-name"]').value;
        const email = addadminform.querySelector('input[name="txt-admin-email"]').value;
        const password = addadminform.querySelector('input[name="txt-admin-password"]').value;
        const repassword = addadminform.querySelector('input[name="txt-admin-repassword"]').value;

        if (name == '' || email == '' || password == '' || repassword == '') {
            showNotication("Thiếu thông tin", 'error');
            return;
        }
        if (confirm('Xác nhận thêm?')) {

            try {
                const data = {
                    "name": name,
                    "username": email,
                    "password": password,
                    "repassword": repassword,
                    "typeOfUser": 0,
                }
                const res = await accountAPI.register(data);
                if (res.success) {
                    showNotication("Thêm Admin thành công");
                }
                ReloadOverview();
            } catch (error) {
                //console.log(error);
                showNotication("Đã tồn tại", 'error');
            }
        }
    })
}

(async () => {
    try {
        // avatarHandle();

        setEventSearch();
        setEventHandlerAcc();
        getUsers(1);

        clearFormHandle();
        addAdmin();

        handleDegreeChange();
        handleExpertRequest();
        getExpertRequest(1);

    } catch (error) {
        console.log(error);
    }
})()
