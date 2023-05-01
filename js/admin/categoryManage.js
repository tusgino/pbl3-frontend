import { getValueForm, setTextContent, showModal } from "../utils";
import categoryAPI from "./categoryAPI";    
import courseAPI from "./courseAPI";
import systemAPI  from "./system";

const token = localStorage.getItem('token');

const addCategory = async() => {

    const categoryname = document.getElementById('category-name');
    const message = categoryname.parentNode.querySelector('.form-message');
    const formadd = document.getElementById('btn-form-addcategory');
    formadd.addEventListener('click',() => {
        categoryname.value = '';
        message.textContent = '';
    })
    const btnadd = document.getElementById('btn-add-category');
    btnadd.addEventListener('click', async() => {
        if(categoryname.value != "") {
            const params = {
                "_category_name" : categoryname.value,
            };
            const res = await categoryAPI.addCategory(params, token);
            
            if(res.message == "Trung") {
                alert("Thêm thất bại");
            } else {
                alert('Thêm thành công');
            }
            getCategories(1);
        }
    })
}

const deleteCategories = async() => {
    const modaldel = document.getElementById('Modal-delcategory');
    const btnmodaldel = document.getElementById('form-delcategory');
    const dataview = document.querySelector('.quanlidanhmuc .data-view');
    const checkboxes = dataview.getElementsByClassName('checkbox-category')

    // btnmodaldel.addEventListener('click', () => {
    //     var check = false;
    //     checkboxes.forEach((checkbox) => {
    //         if(checkbox.value == true) {
    //             check = true;
    //         }
    //     })
    //     if(check == false) {
    //         alert("Chưa chọn cái nào");
    //         return;
    //     }
    // })

    const btndel = document.getElementById('btn-del-category');
    if(!btndel) return;

    btndel.addEventListener('click', async() => {
        const list = [];
        for(let i = 0; i < checkboxes.length; ++i) {
            if(checkboxes[i].checked == true) {
                list.push(checkboxes[i].value);
            }
        }
        console.log(list);
        await categoryAPI.deleteCategories(list, token);
        getCategories(1);
    })
}

const getCategories = async(page) => {
    const checkboxall = document.getElementById('checkbox-all');
    checkboxall.checked = false;

    const params = {
        "_title_like" : document.getElementById('txtsearch-categorymanage').value,
        "page" : page,
    };

    const dataview = document.querySelector(".quanlidanhmuc .data-view");
    dataview.textContent = "";
    
    const { data : {_data, _totalRows}} = await categoryAPI.getAllCategory(params, token);
    systemAPI.renderRecord(_data, 'quanlidanhmuc', createRecord);
    systemAPI.renderPagination(_totalRows, 'quanlidanhmuc', getCategories, page);
};

const setEventSearch = async() => {
    const btnsearch = document.getElementById('btn-search-categorymanage');
    btnsearch.addEventListener('click', async() => {
        getCategories(1);
    })
}

const setEventHandlerCategory = async() => {
    const title = document.querySelector('.quanlidanhmuc .modal-body.vstack input');
    const desc = document.getElementById('category-desc');

    const btnsave = document.getElementById('btn-save-category');
    btnsave.addEventListener('click', async(event) => {
        const patch = [
            {
                "operation": 1,
                "path": "/Name",
                "op": "replace",
                "value": title.value,
            },
            {
                "operation": 1,
                "path": "/Description",
                "op": "replace",
                "value": desc.value,
            },
        ]
        const params = {
            id : event.target.value,
            patchDoc : JSON.stringify(patch),
        };
        if(await categoryAPI.updateCategory(params, token)) alert("Cập nhật thành công");
        getCategories(1);
    });
}

const createRecord = (data) => {
    if(!data) return;
    console.log(data);

    const categoryManageRecord = document.getElementById('categoryManageRecord')
    if(!categoryManageRecord) return;

    const record = categoryManageRecord.content.cloneNode(true);
    if(!record) return;

    setTextContent(record, '[data-id="categoryName"]', data.name);

    const checkbox = record.querySelector('.checkbox-category');
    checkbox.setAttribute('value', `${data.idCategory}`);
    checkbox.addEventListener('click' , () => {
        console.log(checkbox.value);
    })

    const btnsave = document.getElementById('btn-save-category');

    const iconinfo = record.getElementById('categorymanage-iconinfo');
    
    iconinfo.addEventListener('click', async() => {
    
        const title = document.querySelector('.quanlidanhmuc .modal-body.vstack input');
        console.log(title)
        console.log(data.name)
        title.value = data.name;

        const desc = document.getElementById('category-desc');
        desc.value = data.description;

        const ul = document.getElementById('categoryCourseList');
        ul.textContent = "";    
    
        const params = {
            id : data.idCategory,
        }
        const courseList = await courseAPI.getAllCoursesByCategoryID(params, token);
        console.log(courseList);
        courseList.forEach((course) => {
            ul.appendChild(createCourseItem(course));
        });

        btnsave.value = data.idCategory;
    })

    return record;
}

const createCourseItem = (data) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'mt-3');
    li.innerHTML = `<i class="fas fa-book"></i> ${data}`;
    return li;
}

(async() => {
    try {
        getCategories(1);
        
        setEventSearch();

        setEventHandlerCategory();
        
        addCategory();

        deleteCategories();

    } catch(error) {
        console.log(error);
    }
})()