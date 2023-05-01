import accountAPI from "../api/accountAPI";
import userAPI from "./userAPI";


(async() => {

  const imgs = document.querySelectorAll('.avatar');
  console.log(imgs)
  imgs.forEach((img) => {
    img.src = "https://media.istockphoto.com/id/1307140502/vi/vec-to/vector-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-h%E1%BB%93-s%C6%A1-ng%C6%B0%E1%BB%9Di-d%C3%B9ng-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-ch%C3%A2n-dung-avatar-logo-k%C3%BD-t%C3%AAn-ng%C6%B0%E1%BB%9Di-h%C3%ACnh-d%E1%BA%A1ng.jpg?s=612x612&w=0&k=20&c=yCpEW0XGq3LCgCn-0GupWknu4pIYxEm8CigGHnqVkQU=";
  })

  const avatar = document.querySelector('.sidebar .avatar');
  const username = document.getElementById('sidebar-user-name');
  // const userdesc = document.getElementById('sidebar-user-desc');

  const token = localStorage.getItem('token');
  try {
    const res = await accountAPI.checkToken({"token" : token});
    console.log(res);
    if(res.success) {
      const data = await userAPI.getByID({id : res.data.idUser}, token);
      console.log(data)
      avatar.src = data.data.avatar;
      username.textContent = data.data.name;
    }
  } catch (error) {
    console.log(error);
  }

  const checkBox = document.getElementById('checkbox-all');
  if (!checkBox) return;

  checkBox.addEventListener('click', (event) => {
    const checkBoxes = document.querySelectorAll('.checkbox-category');
    checkBoxes.forEach((checkBox) => {
      checkBox.checked = event.target.checked;
    });
  })

  const sidebaritems = document.querySelectorAll('.sidebaritem');
  if(!sidebaritems) return;
  
  sidebaritems.forEach((sidebaritem) => {
    sidebaritem.addEventListener('click', () => {
      const activesidebaritems = document.querySelectorAll('.sidebaritem');
      activesidebaritems.forEach( (item) => {
        item.classList.remove("active");
      })
      sidebaritem.className += ' active'
    });
  })
})()

const systemAPI = {
    renderRecord (list, view, func) {
      const dataview = document.querySelector(`.${view} .data-view`);
      dataview.textContent = "";
      if(!dataview) return;
      if(!Array.isArray(list) || list.length === 0) return;
      
      if(list.length == 0) { dataview.textContent = "Không tìm thấy";}

      list.forEach((item) => {
          const record = func(item);
          if(record) {
              dataview.appendChild(record);
          }
      })
  },

    createPage (pagenum, func) {
        const liElement = document.createElement('li');
        liElement.classList.add("page-item");
        
        liElement.innerHTML = `<span class="page-link">${pagenum}</span>`
        
        liElement.addEventListener('click', async() => {
            func(pagenum);
        })
        return liElement;
    },

    renderPagination (totalRows, view, func, pagechosen) {
      const ulElement = document.createElement('ul');
      ulElement.classList.add("pagination");
      ulElement.classList.add("justify-content-center");
      ulElement.classList.add("gap-2");
      const totalPage = Math.ceil(totalRows / 10);
      for(let i = 1; i <= totalPage; ++i) {
          const liElement = systemAPI.createPage(i, func);
          if(i == pagechosen) liElement.classList.add('active');
          ulElement.appendChild(liElement);
      }
      const dataview = document.querySelector(`.${view} .data-view`);
      dataview.appendChild(ulElement);
  },

}
export default systemAPI;