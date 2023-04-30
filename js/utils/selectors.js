export const getPostList = () => {
  return document.getElementById('list-courses');
}

export const getValueForm = (parent, selector) => {
  return parent.querySelector(selector).value;
}

export const getStatusValue = (selector) => {
  const statusRadioButtons = document.getElementsByName(selector);
  let selectedValue;

  for (let i = 0; i < statusRadioButtons.length; i++) {
    if (statusRadioButtons[i].checked) {
      selectedValue = statusRadioButtons[i].value;
      break;
    }
  }

  return selectedValue;
};