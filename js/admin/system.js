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
      liElement.value = pagenum;  
      liElement.style.border = 'none';
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


    // if(totalRows > 0) {
    //   const previousElement = document.createElement('li');
    //   previousElement.classList.add("page-item");

    //   previousElement.innerHTML = `<span class="page-link"><i class="fas fa-chevron-left"></i></span>`;
      
    //   previousElement.addEventListener('click', () => {
    //     const currentpage = ulElement.querySelector('.active');
    //     const previouspage = currentpage.previousElementSibling;

    //     if(currentpage.value != 1) {
    //       currentpage.classList.remove('active');
    //       previouspage.classList.add('active');
    //     }
    //     func(previouspage.value);

    //   })

    //   ulElement.appendChild(previousElement);
    // }

    for(let i = 1; i <= totalPage; ++i) {
        const liElement = systemAPI.createPage(i, func);
        if(i == pagechosen) liElement.classList.add('active');
        ulElement.appendChild(liElement);
    }

    // if(totalPage > 5) {
    //     const liElement = document.createElement('li');
    //     liElement.classList.add('page-item');
    //     liElement.innerHTML = `<span class="page-link"><i class="fas fa-ellipsis-h"></i></span>`;
    //     ulElement.appendChild(liElement)
    // }
    
    // if(totalRows > 0) {
    //   const nextElement = document.createElement('li');
    //   nextElement.classList.add("page-item");

    //   nextElement.innerHTML = `<span class="page-link"><i class="fas fa-chevron-right"></i></span>`;
      
    //   nextElement.addEventListener('click', () => {
    //     const currentpage = ulElement.querySelector('.active');
    //     const nextpage = currentpage.nextElementSibling;

    //     if(currentpage.value != totalPage) {
    //       currentpage.classList.remove('active');
    //       nextpage.classList.add('active');

    //       func(nextpage.value)
    //     } 
        
    //   })
      
    //   ulElement.appendChild(nextElement);
    // }

    // const dataview = document.querySelector(`.${view} .data-view`);
    // dataview.appendChild(ulElement);



  },

  renderPaginationNew (totalRows, view, func, pagechosen) {
    const paginationtemplate = document.getElementById('pagination');
    if(!paginationtemplate) return;

    const paginationbar = paginationtemplate.content.cloneNode(true);
    const pg = paginationbar.querySelector('[data-id="pagination"]');
    const btnNextPg = paginationbar.querySelector("button.next-page");
    const btnPrevPg = paginationbar.querySelector("button.prev-page");
    const btnFirstPg = paginationbar.querySelector("button.first-page");
    const btnLastPg = paginationbar.querySelector("button.last-page");

    const valuePage = {
      truncate: true,
      curPage: pagechosen,
      numLinksTwoSide: 1,
      totalPages: 10
    };

    valuePage.totalPages = Math.ceil(totalRows/10);
    pagination();
    handleButtonLeft();
    handleButtonRight();

    const pbar = paginationbar.querySelector('div')
    pbar.onclick = function (e) {
      handleButton(e.target);
      func(valuePage.curPage)
    };

    const dataview = document.querySelector(`.${view} .data-view`);
    if(totalRows !== 0) dataview.appendChild(paginationbar);

    pg.onclick = (e) => {
      const ele = e.target;
    
      if (ele.dataset.page) {
        const pageNumber = parseInt(e.target.dataset.page, 10);
    
        valuePage.curPage = pageNumber;
        pagination(valuePage);
    
        handleButtonLeft();
        handleButtonRight();
      }
    };
    
    // DYNAMIC PAGINATION
    function pagination() {
      const { totalPages, curPage, truncate, numLinksTwoSide: delta } = valuePage;
    
      const range = delta + 4; // use for handle visible number of links left side
    
      let render = "";
      let renderTwoSide = "";
      let dot = `<li class="pg-item"><a class="pg-link">...</a></li>`;
      let countTruncate = 0; // use for ellipsis - truncate left side or right side
    
      // use for truncate two side
      const numberTruncateLeft = curPage - delta;
      const numberTruncateRight = curPage + delta;
    
      let active = "";
      for (let pos = 1; pos <= totalPages; pos++) {
        active = pos === curPage ? "active" : "";
    
        // truncate
        if (totalPages >= 2 * range - 1 && truncate) {
          if (numberTruncateLeft > 3 && numberTruncateRight < totalPages - 3 + 1) {
            // truncate 2 side
            if (pos >= numberTruncateLeft && pos <= numberTruncateRight) {
              renderTwoSide += renderPage(pos, active);
            }
          } else {
            // truncate left side or right side
            if (
              (curPage < range && pos <= range) ||
              (curPage > totalPages - range && pos >= totalPages - range + 1) ||
              pos === totalPages ||
              pos === 1
            ) {
              render += renderPage(pos, active);
            } else {
              countTruncate++;
              if (countTruncate === 1) render += dot;
            }
          }
        } else {
          // not truncate
          render += renderPage(pos, active);
        }
      }
    
      if (renderTwoSide) {
        renderTwoSide =
          renderPage(1) + dot + renderTwoSide + dot + renderPage(totalPages);
        pg.innerHTML = renderTwoSide;
      } else {
        pg.innerHTML = render;
      }
    }
    
    function renderPage(index, active = "") {
      return ` <li class="pg-item ${active}" data-page="${index}">
            <a class="pg-link" href="#">${index}</a>
        </li>`;
    }


    function handleButton(element) {
      if (element.classList.contains("first-page")) {
        valuePage.curPage = 1;
        btnFirstPg.disabled = true;
        btnPrevPg.disabled = true;
        btnNextPg.disabled = false;
        btnLastPg.disabled = false;
      } else if (element.classList.contains("last-page")) {
        valuePage.curPage = parseInt(valuePage.totalPages, 10);
        btnFirstPg.disabled = false;
        btnPrevPg.disabled = false;
        btnNextPg.disabled = true;
        btnLastPg.disabled = true;
      } else if (element.classList.contains("prev-page")) {
        valuePage.curPage--;
        handleButtonLeft();
        btnNextPg.disabled = false;
        btnLastPg.disabled = false;
      } else if (element.classList.contains("next-page")) {
        valuePage.curPage++;
        handleButtonRight();
        btnPrevPg.disabled = false;
        btnFirstPg.disabled = false;
      }
      console.log(valuePage)
      pagination();
    }
    function handleButtonLeft() {
      if (valuePage.curPage === 1) {
        btnPrevPg.disabled = true;
        btnFirstPg.disabled = true;
      } else {
        btnPrevPg.disabled = false;
        btnFirstPg.disabled = false;
      }
    }
    function handleButtonRight() {
      if (valuePage.curPage === valuePage.totalPages) {
        btnNextPg.disabled = true;
        btnLastPg.disabled = true;
      } else {
        btnNextPg.disabled = false;
        btnLastPg.disabled = false;
      }
    }
  },

}
export default systemAPI;

 
    



 