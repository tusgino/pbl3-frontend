export const getPostList = () => {
  return document.getElementById('list-courses');
}

export const getValueForm = (parent, selector) => {
  return parent.querySelector(selector).value;
}