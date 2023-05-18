import courseAPI from "./api/courseAPI";
import lessonAPI from "./api/lessonAPI";
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

const createCourse = (course, profileId, chapters) => {
  if (!course) return;
  const liTemplate = document.getElementById('learningTemplate');
  if (!liTemplate) return;
  const liElement = liTemplate.content.cloneNode(true);
  if (!liElement) return;

  let countCourses = 0;
  let countCoursed = 0;

  if (chapters.length !== 0) {
    chapters.forEach(chapter => {
      // console.log(chapter);
      if (chapter.lessons.length !== 0) {
        // console.log(chapter.lessons);
        chapter.lessons.forEach(lesson => {
          countCourses++;
          if (lesson.status === 1) {
            countCoursed++;
          }
        })
      }
    })
  }

  // console.log(countCoursed);
  // console.log(countCourses);
  console.log(`${countCoursed}/${countCourses}`);

  const percent = (countCoursed / countCourses) * 100;
  console.log(percent);

  setTextContent(liElement, '.value .learned', countCoursed);
  setTextContent(liElement, '.value .total', countCourses);

  const progressBar = liElement.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', countCoursed);
    progressBar.setAttribute('aria-valuemax', countCourses);

  }

  setSrcContent(liElement, '[data-id="thumbnail"]', course?.thumbnail);
  setTextContent(liElement, '[data-id="title"]', course?.title);
  setTextContent(liElement, '[data-id="name"]', course?.nameUser);
  setSrcContent(liElement, '[data-id="avatar"]', course?.avatarUser);

  // console.log(course);
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
  const token = localStorage.getItem('token');
  courses.forEach(async (course) => {
    if (course.statusPurchase) {
      const params = {
        idCourse: course.id,
        idUser: profileId,
      }
      const { data } = await lessonAPI.getAllLesson(params, token);
      const liElement = createCourse(course, profileId, data.chapters);
      if (liElement)
        ulElement.appendChild(liElement);
    }
  })
}

const renderTradeUI = (data) => {

  const ulElement = document.querySelector('.trade-list');
  data.forEach(course => {
    // console.log(course);
    const tradeTemplate = document.getElementById('tradeTemplate');
    if (!tradeTemplate) return;
    const tradeElement = tradeTemplate.content.cloneNode(true);
    if (!tradeElement) return;
    setTextContent(tradeElement, '[data-id="name"]', course.title);
    const dateConvert = new Date(course.datePurchase);
    const day = String(dateConvert.getDate()).padStart(2, '0');
    const month = String(dateConvert.getMonth() + 1).padStart(2, '0');
    const year = dateConvert.getFullYear();
    const date = `${day}/${month}/${year}`;
    setTextContent(tradeElement, '[data-id="time"]', date);
    if (course?.statusPurchase === 1) {
      tradeElement.querySelector('.item-status').classList.add('success');
      setTextContent(tradeElement, '[data-id="status"]', 'Hoàn thành');
    }
    else {
      tradeElement.querySelector('.item-status').classList.add('pending');
      setTextContent(tradeElement, '[data-id="status"]', 'Đang chờ xử lý');
    }
    ulElement.appendChild(tradeElement);
  });
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
    renderTradeUI(data);
    // console.log(res);
    // renderLearningUI(res.data);
  } catch (error) {
    console.log('Failed', error);
  }
}


const updateNotAvatar = async (id) => {
  const loadingOverlay = document.getElementById('loading-overlay');
  loadingOverlay.classList.remove('hidden');
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
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
}

const handleSaveInfo = async (id) => {
  document.querySelector('.save-info').addEventListener('click', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('file-upload');
    if (!fileInput) return;
    if (!fileInput.files[0]) {
      updateNotAvatar(id);
      return;
    };
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