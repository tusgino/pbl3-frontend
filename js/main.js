const handleButtonLogin = () => {
  const btn_login = document.querySelector(".btn-login");
  if (btn_login) {
    btn_login.addEventListener('click', () => {
      window.location.href = "/login.html";
    })
  }
  const token = localStorage.getItem('token');
  if (token) {
    const logout = document.querySelector('.navbar-nav .nav-item > i');
    if (logout) {
      logout.classList.remove('fa-shopping-bag');
      logout.classList.add('fa-sign-out-alt');
      logout.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = "/";
      })
    }
  }
}


(() => {
  handleButtonLogin();
})()