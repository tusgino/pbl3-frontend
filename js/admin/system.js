import accountAPI from "../api/accountAPI";
import userAPI from "./userAPI";


const systemAPI = {
  renderRecord (list, view, func) {
    console.log(list)
    const dataview = document.querySelector(`.${view} .data-view`);
    dataview.textContent = "";
    if(!dataview) return;
    if(!Array.isArray(list) || list.length === 0) {
      dataview.innerHTML = `<h2 style="text-align:center">Không tìm thấy đối tượng thoả mãn</h2>`;
      return;
    }
    
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
      //console.log(valuePage)
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

 
    



 