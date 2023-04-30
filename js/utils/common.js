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

export const showNotication = (content, message = 'success') => {
  // const notification = document.querySelector('.notification');
  // const notificationContent = notification.querySelector('.notification-content');
  // const notificationProgress = document.querySelector('.notification-progress');

  const notification = document.createElement('div');
  notification.classList.add('notification');

  const notificationContent = document.createElement('p');
  notificationContent.classList.add('notification-content');
  notificationContent.textContent = 'Welcome Huanmd';

  const notificationProgress = document.createElement('div');
  notificationProgress.classList.add('notification-progress');

  notification.appendChild(notificationContent);
  notification.appendChild(notificationProgress);

  document.body.appendChild(notification);

  if (message == 'error') {
    notification.classList.add('error');
  }


  function showNotification(message) {
    notificationContent.textContent = message;
    notification.classList.add('active');
    notificationProgress.style.transform = 'scaleX(0)';
  }

  function hideNotification() {
    notification.classList.remove('active');
  }

  showNotification(content);
  setTimeout(hideNotification, 3200);
}

export const toVND = (value) => {

  // Format the VND value with commas for thousands separator
  var formattedVND = value.toLocaleString('vi-VN');

  // Append "đ" symbol to the formatted VND value
  formattedVND += "đ";

  // Return the formatted VND value
  return formattedVND;
}