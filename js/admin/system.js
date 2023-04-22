(() => {
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
      if(!Array.isArray(list) || list.length === 0) return;
      const dataview = document.querySelector(`.${view} .data-view`);
      if(!dataview) return;

      list.forEach((item) => {
          const record = func(item);
          if(record) {
              dataview.appendChild(record);
          }
      })
  },

    createPage (data, func) {
        const liElement = document.createElement('li');
        liElement.classList.add("page-item");
        liElement.classList.add("btn");

        liElement.textContent = data;

        liElement.addEventListener('click', async() => {
            func(data);
        })
        // console.log(liElement);
        return liElement;
    },

    renderPagination (totalRows, view, func) {
      const ulElement = document.createElement('ul');
      ulElement.classList.add("pagination");
      ulElement.classList.add("justify-content-center");
      ulElement.classList.add("gap-2");
      const totalPage = Math.ceil(totalRows / 10);
      for(let i = 1; i <= totalPage; ++i) {
          ulElement.appendChild(systemAPI.createPage(i, func));
      }
      const dataview = document.querySelector(`.${view} .data-view`);
      dataview.appendChild(ulElement);
      // console.log(ulElement);
  },

}
export default systemAPI;