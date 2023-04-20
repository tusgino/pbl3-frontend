import courseAPI from "./api/courseAPI";
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
    if (!profileId)
      window.location.href = '/index.html';
    const token = localStorage.getItem('token');
    const params = {
      id: profileId,
    }
    const { data } = await userAPI.getByID(params, token);
    renderUIProfile(data);
    handleSaveInfo(profileId);
  } catch (error) {
    console.log('Failed', error);
  }
}

const createCourse = (course, profileId) => {
  if (!course) return;
  const liTemplate = document.getElementById('learningTemplate');
  if (!liTemplate) return;
  const liElement = liTemplate.content.cloneNode(true);
  if (!liElement) return;

  setSrcContent(liElement, '[data-id="thumbnail"]', course?.thumbnail);
  setTextContent(liElement, '[data-id="title"]', course?.title);
  setTextContent(liElement, '[data-id="name"]', course?.nameUser);
  setSrcContent(liElement, '[data-id="avatar"]', course?.avatarUser);

  console.log(course);
  liElement.firstElementChild?.addEventListener('click', (e) => {
    // e.preventDefault();
    window.location.href = `/lesson/index.html?id=${profileId}&course=${course?.id}`;
  });

  return liElement;
}

const renderLearningUI = async (courses, profileId) => {
  if (!Array.isArray(courses) || courses.length === 0) return;
  const ulElement = document.querySelector('.learning-list');
  if (!ulElement) return;
  courses.forEach(course => {
    const liElement = createCourse(course, profileId);
    if (liElement)
      ulElement.appendChild(liElement);
  })
}

const handleLearning = async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const profileId = searchParams.get('id');
    if (!profileId)
      window.location.href = '/index.html';
    const token = localStorage.getItem('token');
    const params = {
      id: profileId,
    }
    const { data } = await courseAPI.getByIDUser(params, token);
    console.log(data);
    renderLearningUI(data, profileId);
    // console.log(res);
    // renderLearningUI(res.data);
  } catch (error) {
    console.log('Failed', error);
  }
}

const handleSaveInfo = async (id) => {
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
      // console.log(res);
      const formName = document.querySelector('#name');
      if (!formName) return;
      const formEmail = document.querySelector('#email');
      if (!formEmail) return;
      const formPhone = document.querySelector('#phone');
      if (!formPhone) return;
      const formPassword = document.querySelector('#password');
      if (!formPassword) return;
      const data = [
        {
          "path": "name",
          "op": "replace",
          "value": formName.value
        },
        {
          "path": "phoneNumber",
          "op": "replace",
          "value": formPhone.value
        },
        {
          "path": "avatar",
          "op": "replace",
          "value": res.contentLink
        }
      ]
      const resUpdate = await userAPI.updateByID(id, data, token);
      if (resUpdate.success) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      loadingOverlay.classList.add('hidden');
    }
  });


}



(() => {
  const searchParams = new URLSearchParams(window.location.search);
  handleProfile();
  handleLearning();
  handleAvatarChange();
  const page = searchParams.get('page');
  if (page == 'profile') {
    const tabInfo = document.getElementById('info-tab');
    const info = document.getElementById('info');
    const tabDashboard = document.getElementById('learning-tab');
    const dashboard = document.getElementById('learning');

    dashboard.classList.add('fade');
    tabInfo.classList.add('active');
    info.classList.add('active');

    tabDashboard.classList.remove('active');
    dashboard.classList.remove('active');
    info.classList.remove('fade');
  }

  if (page == 'learning') {
    const tabInfo = document.getElementById('info-tab');
    const info = document.getElementById('info');
    const tabDashboard = document.getElementById('learning-tab');
    const dashboard = document.getElementById('learning');


    tabDashboard.classList.add('active');
    dashboard.classList.add('active');
    info.classList.add('fade');

    dashboard.classList.remove('fade');
    tabInfo.classList.remove('active');
    info.classList.remove('active');
  }



})()