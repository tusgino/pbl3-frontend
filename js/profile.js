import uploadAPI from "./api/uploadAPI";
import userAPI from "./api/userAPI";
import { setSrcContent, setTextContent } from "./utils";

const handleAvatarChange = () => {
  document.getElementById('file-upload').addEventListener('change', function (event) {
    var file = event.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function (event) {
      var imagePreview = document.getElementById('file-image');
      imagePreview.src = event.target.result;
      imagePreview.classList.remove('hidden');
    };

    fileReader.readAsDataURL(file);
  });
}

const renderUIProfile = (profile) => {
  if (!profile) return;
  setTextContent(document, '.user-name', profile.name);
  if (profile.idTypeOfUser == 2) {
    setTextContent(document, '.user-desc', 'Học viên tại THH');
  }
  setSrcContent(document, '.avatar', profile.avatar);
  const imagePreview = document.getElementById('file-image');
  if (!imagePreview) return;
  imagePreview.src = profile.avatar;
  imagePreview.classList.remove('hidden');
  const formName = document.querySelector('#name');
  if (!formName) return;
  formName.value = profile.name;
  const formEmail = document.querySelector('#email');
  if (!formEmail) return;
  formEmail.value = profile.email;
  const formPhone = document.querySelector('#phone');
  if (!formPhone) return;
  formPhone.value = profile.phoneNumber;
  const formPassword = document.querySelector('#password');
  if (!formPassword) return;
  formPassword.value = "*******";
}

const handleProfile = async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const profileId = searchParams.get('id');
    // console.log(courseId);
    if (!profileId)
      window.location.href = '/index.html';
    const token = localStorage.getItem('token');
    const params = {
      id: profileId,
    }
    const { data } = await userAPI.getByID(params, token);
    console.log(data);
    renderUIProfile(data);
  } catch (error) {
    console.log('Failed', error);
  }
}

const handleSaveInfo = async () => {
  document.querySelector('.save-info').addEventListener('click', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('file-upload');
    if (!fileInput) return;
    if (!fileInput.files[0]) return;
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await uploadAPI.uploadImage(formData, token);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      loadingOverlay.classList.add('hidden');
    }
  });


}

(() => {
  // const searchParams = new URLSearchParams(window.location.search);
  // handleProfile();
  // handleAvatarChange();
  // handleSaveInfo();
  // const page = searchParams.get('page');
  // console.log(page);
  // if (page == 'profile') {
  //   const tabInfo = document.getElementById('info-tab');
  //   const info = document.getElementById('info');
  //   const tabDashboard = document.getElementById('learning-tab');
  //   const dashboard = document.getElementById('learning');

  //   dashboard.classList.add('fade');
  //   tabInfo.classList.add('active');
  //   info.classList.add('active');

  //   tabDashboard.classList.remove('active');
  //   dashboard.classList.remove('active');
  //   info.classList.remove('fade');
  // }

  // if (page == 'learning') {
  //   const tabInfo = document.getElementById('info-tab');
  //   const info = document.getElementById('info');
  //   const tabDashboard = document.getElementById('learning-tab');
  //   const dashboard = document.getElementById('learning');


  //   tabDashboard.classList.add('active');
  //   dashboard.classList.add('active');
  //   info.classList.add('fade');

  //   dashboard.classList.remove('fade');
  //   tabInfo.classList.remove('active');
  //   info.classList.remove('active');
  // }

})()