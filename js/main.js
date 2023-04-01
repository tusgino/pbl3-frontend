const handleButtonLogin = () => {
  const btn_login = document.querySelector(".btn-login");
  if (btn_login) {
    btn_login.addEventListener('click', () => {
      window.location.href = "/login.html";
    })
  }
}

(() => {
  handleButtonLogin();
})()