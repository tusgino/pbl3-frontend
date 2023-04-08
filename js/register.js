import { getValueForm, showModal } from './utils'
import accountAPI from './api/accountAPI'

(async () => {
  const formRegister = document.getElementById('registerForm');
  formRegister.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = getValueForm(document, '#fullname');
    const email = getValueForm(document, '#email');
    const password = getValueForm(document, '#password');
    const rePassword = getValueForm(document, '#password_confirmation');
    const role = getValueForm(document, '#roles');
    // console.log(name, email, password, rePassword, role);
    if (role == 'default' || name == '' || email == '' || password == '' || rePassword == '') {
      showModal('Lỗi đăng kí', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const data = {
        name,
        "username": email,
        "password": password,
        "rePassword": rePassword,
        "typeOfUser": role,
      };

      const res = await accountAPI.register(data);
      if (res.success) {
        showModal('Đăng kí thành công', 'Vui lòng đăng nhập');
        setTimeout(() => {
          window.location.assign('/login.html');
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  });
})();