(() => {
  const checkBox = document.getElementById('checkbox-all');
  if (!checkBox) return;

  checkBox.addEventListener('click', (event) => {
    const checkBoxes = document.querySelectorAll('.checkbox-category');
    checkBoxes.forEach((checkBox) => {
      checkBox.checked = event.target.checked;
    });
  })
})()