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

