import userAPI from "./userAPI";


(async() => {
    // lay du lieu tu filter bar
    

    // do du lieu ra view
    
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

        const viewData = res.data.map(item => {
            return {
                "Tên người dùng": item.name,
                "Loại người dùng": item.typeOfUser,
                "Ngày tạo tài khoản" : item.dateCreate, 
                "Trạng thái tài khoản" : item.status
            }
        });
        console.log(viewData)
        const dataContainer = document.querySelector(".quanlinguoidung .data-view");
        res.data.forEach(item => {
            const element = document.createElement('div');
            element.textContent = item.attribute1;
            dataContainer.appendChild(element);
        });
        
        dataContainer.innerHTML = JSON.stringify(res.data)

    } catch (error) {
        console.log(error);
    }




})()