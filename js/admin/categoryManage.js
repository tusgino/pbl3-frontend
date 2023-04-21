import { setTextContent } from "../utils";
import categoryAPI from "./categoryAPI";

const token = localStorage.getItem('token');

const getCategories = async(page) => {
    const params = {
    "_title_like" : document.getElementById('txtsearch-categorymanage').value,
    "page" : page,
    };

    const dataview = document.querySelector(".quanlidanhmuc .data-view");
    dataview.textContent = "";
    
    const { data : {_data, _totalRows}} = await categoryAPI.getAllCategory(params, token);

    renderRecord(_data);
    renderPagination(_totalRows);


};

const setEventSearch = () => {
    const btnsearch = document.getElementById('btn-search-categorymanage');
    btnsearch.addEventListener('click', async() => {
        getCategories(1);
    })

}

const createRecord = (data) => {
    if(!data) return;

    const categoryManageRecord = document.getElementById('categoryManageRecord')
    if(!categoryManageRecord) return;

    const record = categoryManageRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="categoryName"]', data.name);


    return record;
}

const renderRecord = (userList) => {
    
    if(!Array.isArray(userList) || userList.length === 0) return;
    const dataview = document.querySelector(".quanlidanhmuc .data-view");
    console.log(dataview);
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
        getUsers(data);
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