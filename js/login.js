import accountAPI from "./api/accountAPI";
import { getValueForm, showModal, showNotication } from "./utils";


(async () => {
  const form = document.getElementById('loginForm');
  // console.log(form);
  if (!form) return;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = getValueForm(document, '#email');
    const password = getValueForm(document, '#password');
    if (email == '' || password == '') {
      showModal('Lỗi đăng nhập', 'Vui lòng điền đầy đủ thông tin');
    }

    const data = {
      "username": email,
      "password": password,
    }

    try {
      const res = await accountAPI.login(data);
      if (res.success) {
        showModal('Đăng nhập thành công', 'Đang chuyển hướng...');
        localStorage.setItem('token', res.data);
        // console.log(res.data);
        setTimeout(() => {
          window.location.assign('/');
        }, 1000);
      }
    } catch (error) {
      console.log(res);
      console.log(error);
      showNotication('Lỗi đăng nhập, vui lòng thử hoặc liên hệ admin!', 'error');
    }

  })
})()