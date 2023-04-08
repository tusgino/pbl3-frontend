export const setTextContent = (parent, selector, text) => {
  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export const setSrcContent = (parent, selector, src) => {
  const element = parent.querySelector(selector);
  if (element) element.src = src;
  element.addEventListener('error', () => {
    element.src = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
  });
}

export const toVND = (value) => {

  // Format the VND value with commas for thousands separator
  var formattedVND = value.toLocaleString('vi-VN');

  // Append "đ" symbol to the formatted VND value
  formattedVND += "đ";

  // Return the formatted VND value
  return formattedVND;
}