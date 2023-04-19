import { setTextContent } from "../utils";
import userAPI from "./userAPI";

const createRecord = (data) => {
    if(!data) return;

    const userManageRecord = document.getElementById('userManageRecord')
    if(!userManageRecord) return;

    const record = userManageRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="userName"', data.name);
    setTextContent(record, '[data-id="userType"', data.typeOfUser);
    setTextContent(record, '[data-id="dateCreate"', data.dateCreate);
    setTextContent(record, '[data-id="userStatus"', data.status);
    

}

const renderRecord = (userList) => {
    
    if(!Array.isArray(userList) || userList.length === 0) return;
    const dataview = document.querySelector(".quanlinguoidung .data-view");
    console.log(dataview);
    if(!dataview) return;
    userList.forEach((user) => {
        const record = createRecord(user);
        if(record) {
            dataview.appendChild(record);
        }
    });
}
(async() => {    
    try {

        const params = {
            "_is_student" : true, 
            "_is_expert" : true,
            "_is_admin" : true,
            "_status_active" : true, 
            "_status_banned" : true,
            "page" : 1,
        };
        const token = localStorage.getItem('token');
        const res = await userAPI.getAllUsersByFiltering(params, token);
        console.log(res.data);

        renderRecord(res.data)

        const viewData = res.data.map(item => {
            return {
                "Tên người dùng": item.name,
                "Loại người dùng": item.typeOfUser,
                "Ngày tạo tài khoản" : item.dateCreate, 
                "Trạng thái tài khoản" : item.status
            }
        });
        console.log(viewData)


        // const dataContainer = document.querySelector(".quanlinguoidung .data-view");
        // res.data.forEach(item => {
        //     const element = document.createElement('div');
        //     element.textContent = item.attribute1;
        //     dataContainer.appendChild(element);
        // });
        
        //dataContainer.innerHTML = JSON.stringify(res.data)

    } catch (error) {
        console.log(error);
    }




})()