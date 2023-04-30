import expertAPI from "../api/expertAPI";
import userAPI from "../api/userAPI";
import uploadAPI from "../api/uploadAPI";
import { setSrcContent, setTextContent, showNotication } from "../utils";
import courseAPI from "../api/courseAPI";

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
  document.getElementById('degree-upload').addEventListener('change', function (event) {
    var file = event.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function (event) {
      var imagePreview = document.getElementById('degree-image');
      imagePreview.src = event.target.result;
      imagePreview.classList.remove('hidden');
      document.getElementById('degree-drag').style.border = "0px";
    };

    fileReader.readAsDataURL(file);
  });
}

const handleBanking = async (idBanking) => {
  if (!idBanking) return;
  const token = localStorage.getItem('token');
  const params = {
    idBankInfo: idBanking,
  }
  const { data } = await expertAPI.getBankingByID(params, token);

  const bankingNumber = document.getElementById('bankinfo-number');
  if (!bankingNumber) return;
  bankingNumber.value = data.bankAccountNumber;
  const bankingName = document.getElementById('bankinfo-name');
  if (!bankingName) return;
  bankingName.value = data.accountName;
  const bankingNameBank = document.getElementById('bankinfo-bankname');
  if (!bankingNameBank) return;
  bankingNameBank.value = data.bankName;
  document.querySelector('.bankinfo-save').addEventListener('click', async (e) => {
    e.preventDefault();
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('hidden');
    const dataNew = [];
    if (bankingNumber.value != data.bankAccountNumber)
      dataNew.push({
        "op": "replace",
        "path": "/bankAccountNumber",
        "value": bankingNumber.value
      });
    if (bankingName.value != data.accountName)
      dataNew.push({
        "op": "replace",
        "path": "/accountName",
        "value": bankingName.value
      });
    if (bankingNameBank.value != data.bankName)
      dataNew.push({
        "op": "replace",
        "path": "/bankName",
        "value": bankingNameBank.value
      });
    try {
      await expertAPI.updateBanking(idBanking, dataNew, token);
      showNotication('Cập nhật thông tin thành công');
    } catch (error) {
      showNotication(error.response.data.message);
    }
    finally {
      loadingOverlay.classList.add('hidden');
      var myModalEl = document.getElementById('bankinfo-modal');
      var modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();
    }
  })
}

const handleDegree = async (idUser) => {
  if (!idUser) return;
  const token = localStorage.getItem('token');
  const { data } = await expertAPI.getDegreeByIDUser(idUser, token);
  const degreeList = document.querySelector('.degree-list');
  if (!degreeList) return;
  degreeList.innerHTML = '';
  const degreeTemplate = document.getElementById('degree-template');
  if (!degreeTemplate) return;
  data.forEach(degree => {
    const degreeItem = degreeTemplate.content.cloneNode(true);
    if (!degreeItem) return;
    const liElement = degreeItem.querySelector(".degree-item");
    if (!liElement) return;
    liElement.dataset.degree = degree.idDegree;
    const clickBtn = degreeItem.querySelector('[data-bs-target="#degree-modal"]');
    clickBtn.addEventListener('click', async () => {
      const degreeInfo = document.querySelector('.degree-info');
      const degreeModal = document.getElementById('degree-modal');
      if (!degreeInfo) return;
      const { data } = await expertAPI.getDegreeByIDDgree(liElement.dataset.degree, token);
      degreeInfo.querySelector('#degree-name').value = data.name;
      degreeInfo.querySelector('#degree-desc').value = data.description;
      setSrcContent(degreeInfo, '#degree-image', data.image);
      degreeInfo.querySelector('#degree-image').classList.remove('hidden');
      setTextContent(degreeModal, '.degree-title', 'Thông tin bằng cấp');
      const btnSave = degreeModal.querySelector('.degree-save');
      const btnCancel = degreeModal.querySelector('.degree-cancel');
      if (!btnSave) return;
      btnCancel.setAttribute('data-bs-dismiss', 'modal');
      btnSave.addEventListener('click', async (e) => {
        e.preventDefault();
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.remove('hidden');
        const dataNew = [];
        if (degreeInfo.querySelector('#degree-name').value != data.name)
          dataNew.push({
            "op": "replace",
            "path": "Name",
            "value": degreeInfo.querySelector('#degree-name').value
          });
        if (degreeInfo.querySelector('#degree-desc').value != data.description)
          dataNew.push({
            "op": "replace",
            "path": "Description",
            "value": degreeInfo.querySelector('#degree-desc').value
          });
        if (degreeInfo.querySelector('#degree-image').src != data.image) {
          const formData = new FormData();
          formData.append('file', document.getElementById('degree-upload').files[0]);
          const { contentLink } = await uploadAPI.uploadImage(formData, token);
          dataNew.push({
            "op": "replace",
            "path": "Image",
            "value": contentLink
          });
        }
        try {
          await expertAPI.updateDegree(liElement.dataset.degree, dataNew, token);
          showNotication('Cập nhật thông tin thành công');
          setTextContent(liElement, '.degree-title', degreeInfo.querySelector('#degree-name').value);
          // console.log(liElement);
          // handleDegree(idUser);
        } catch (error) {
          showNotication(error.response.data.message, 'error');
        }
        finally {
          loadingOverlay.classList.add('hidden');
          var myModalEl = document.getElementById('degree-modal');
          var modal = bootstrap.Modal.getInstance(myModalEl);
          modal.hide();
        }
      });
    })
    setTextContent(degreeItem, '.degree-title', degree.name);
    document.getElementById('degree-modal').addEventListener('hidden.bs.modal', () => {
      const degreeInfo = document.querySelector('.degree-info');
      if (!degreeInfo) return;
      degreeInfo.querySelector('#degree-name').value = "";
      degreeInfo.querySelector('#degree-desc').value = "";
      degreeInfo.querySelector('#degree-image').classList.add('hidden');
      document.getElementById('degree-drag').style.border = "2px dashed #787878";
    })
    degreeList.appendChild(degreeItem);
  });
}

const handleEmptyDegree = (idUser) => {
  const btnAdd = document.getElementById('add-degree');
  if (!btnAdd) return;
  btnAdd.addEventListener('click', () => {
    const degreeModal = document.querySelector('#degree-modal');
    if (!degreeModal) return;
    const btnCancel = degreeModal.querySelector('.degree-cancel');
    if (!btnCancel) return;
    btnCancel.setAttribute('data-bs-dismiss', 'modal');
    setTextContent(degreeModal, '.degree-save', 'Thêm');
  })
  const btnSave = document.querySelector('.degree-save');
  if (!btnSave) return;
  btnSave.addEventListener('click', async (e) => {
    e.preventDefault();

    const loadingOverlay = document.getElementById('loading-overlay');
    try {
      loadingOverlay.classList.remove('hidden');
      const degreeName = document.getElementById('degree-name');
      if (!degreeName) return;
      const degreeDesc = document.getElementById('degree-desc');
      if (!degreeDesc) return;
      const fileInput = document.getElementById('degree-upload');
      if (!fileInput) return;
      const file = fileInput.files[0];
      if (!file) {
        showNotication('Vui lòng chọn ảnh', 'error');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const { contentLink } = await uploadAPI.uploadImage(formData, token);
      const data =
      {
        idUser,
        "name": degreeName.value,
        "image": contentLink,
        "description": degreeDesc.value,
      }
      const res = await expertAPI.addDegree(data, token);
      // console.log(res);
      handleDegree(idUser);
    } catch (error) {
      console.log(error);
    }
    finally {
      loadingOverlay.classList.add('hidden');
      var myModalEl = document.getElementById('degree-modal');
      var modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();
    }
  });
}

const handleEmptyBanking = (idUser, idBankAccount) => {
  const bankingNumber = document.getElementById('bankinfo-number');
  if (!bankingNumber) return;
  const bankingName = document.getElementById('bankinfo-name');
  if (!bankingName) return;
  const bankingNameBank = document.getElementById('bankinfo-bankname');
  if (!bankingNameBank) return;
  if (!idBankAccount) {
    document.querySelector('.bankinfo-save').addEventListener('click', async (e) => {
      e.preventDefault();
      const loadingOverlay = document.getElementById('loading-overlay');
      loadingOverlay.classList.remove('hidden');
      const token = localStorage.getItem('token');
      const params = {
        bankAccountNumber: bankingNumber.value,
        accountName: bankingName.value,
        bankName: bankingNameBank.value,
        idUser: idUser
      }
      const response = await expertAPI.postBanking(params, token);
      console.log(response);
      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        var myModalEl = document.getElementById('bankinfo-modal');
        var modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
        showNotication('Thêm tài khoản ngân hàng thành công!');
      }, 1000);
    });
  }
}

const renderUIProfile = (profile) => {
  if (!profile) return;
  setTextContent(document, '.user-name', profile.name);
  if (profile.idTypeOfUser == 1) {
    setTextContent(document, '.user-desc', 'Chuyên gia tại HTT');
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
  handleBanking(profile.idBankAccount);
  handleEmptyBanking(profile.idUser, profile.idBankAccount);
  handleDegree(profile.idUser);
  handleEmptyDegree(profile.idUser);
}

const handleProfile = async (searchParams) => {
  const idUser = searchParams.get('id');
  if (!idUser)
    window.location.href = '/index.html';
  try {
    const token = localStorage.getItem('token');
    const params = {
      id: idUser,
    }
    const { data } = await userAPI.getByID(params, token);
    renderUIProfile(data);
    handleSaveInfo(idUser);
  } catch (error) {
    console.log(error);
  }
}

const renderUI = (searchParams) => {
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

  if (page == 'courses') {
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
  document.querySelector('.save-info.save-form').addEventListener('click', async (event) => {
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

const renderCourse = (course, idUser) => {
  if (!course) return;
  const courseTemplate = document.getElementById('course-template');
  if (!courseTemplate) return;
  const courseElement = courseTemplate.content.cloneNode(true);
  setTextContent(courseElement, '[data-id="title"]', course.title);
  setSrcContent(courseElement, '[data-id="thumbnail"]', course.thumbnail);
  courseElement.firstElementChild?.addEventListener('click', () => {
    window.location.href = `/expert/detail.html?idUser=${idUser}&id=${course.id}`;
  });
  return courseElement;
}

const renderCourseList = (courseList, idUser) => {
  if (!Array.isArray(courseList) || courseList.length == 0) return;
  const courseListContainer = document.querySelector('.learning-list');
  if (!courseListContainer) return;
  courseListContainer.innerHTML = '';
  courseList.forEach(course => {
    const liElement = renderCourse(course, idUser);
    courseListContainer.appendChild(liElement);
  });
}

const handleCourses = async (searchParams) => {
  const idUser = searchParams.get('id');
  const token = localStorage.getItem('token');
  if (!token) return;
  const params = {
    id: idUser,
  };
  try {
    const { data } = await courseAPI.getByIDUser(params, token);
    renderCourseList(data, idUser);
    document.querySelector('.create-course').addEventListener('click', () => {
      window.location.href = `/expert/detail.html?idUser=${idUser}`;
    })
  } catch (error) {
    console.log(error);
  }
}


(() => {
  const searchParams = new URLSearchParams(window.location.search);
  handleAvatarChange();
  renderUI(searchParams);
  handleProfile(searchParams);
  handleCourses(searchParams);
})()