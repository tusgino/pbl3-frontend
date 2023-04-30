import axiosClient from "../api/axiosClient";
import categoryAPI from "../api/categoryAPI";
import courseAPI from "../api/courseAPI";
import uploadAPI from "../api/uploadAPI";
import { getStatusValue, getValueForm, showNotication } from "../utils";

const handleImageChange = () => {
  document.getElementById('file-upload').addEventListener('change', function (event) {
    console.log('image');
    var file = event.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function (event) {
      var imagePreview = document.getElementById('file-image');
      imagePreview.src = event.target.result;
      imagePreview.classList.remove('hidden');
    };

    fileReader.readAsDataURL(file);
    document.getElementById('file-drag').style.border = "0px";
  });
}

const handleVideoChange = () => {
  const fileUpload = document.getElementById('video-upload');

  fileUpload.addEventListener('change', function (event) {
    console.log('video');
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      const videoPreview = document.getElementById('file-video');
      videoPreview.src = event.target.result;
      videoPreview.classList.remove('hidden');

    };

    fileReader.readAsDataURL(file);
    document.querySelector('#file-drag.video-drag').style.border = "0px";
  });
};


const fillCategory = async () => {
  try {
    const { data: { _data } } = await categoryAPI.getAll({
      page: 1,
      _title_like: '',
    });
    console.log(_data);
    const categories = document.getElementById('category');
    if (!categories) return;
    _data.forEach(category => {
      const categoryElement = document.createElement('option');
      categoryElement.value = category.idCategory;
      categoryElement.innerText = category.name;
      categories.appendChild(categoryElement);
    });
  } catch (error) {
    console.log(error);
  }
}

const handleSave = async (searchParams, editor) => {
  const token = localStorage.getItem('token');
  const idUser = searchParams.get('idUser');
  if (!idUser) return;
  const detailForm = document.querySelector('.detail-form');
  if (!detailForm) return;
  const btnSave = document.querySelector('.btn-save');
  if (!btnSave) return;
  btnSave.onclick = async () => {
    const idCategory = getValueForm(detailForm, '#category');
    const courseName = getValueForm(detailForm, '#course-name');
    const price = getValueForm(detailForm, '#course-price');
    // const description = getDescriptionValue();
    // Get the editor instance
    // Get the formatted HTML content from the editor
    const description = await editor.getData();

    const discount = getValueForm(detailForm, '#course-discount');
    const status = getStatusValue('status');

    // Handle Image and Video upload
    const fileInput = document.getElementById('file-upload');
    const videoInput = document.getElementById('video-upload');
    if (!fileInput) return;
    if (!videoInput) return;
    const file = fileInput.files[0];
    const video = videoInput.files[0];
    if (!file || !video) {
      showNotication('Vui lòng tải ảnh và Video', 'error');
    }
    const formData = new FormData();
    const formVideo = new FormData();

    formData.append('file', file);
    formVideo.append('file', video);

    const progressBar = document.querySelector('.progress');
    const message = document.querySelector('.message');
    message.textContent = 'Đang tải...';

    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const url = `/Upload/upload`;
      const config = {
        onUploadProgress: (progressEvent) => {
          const percent = (progressEvent.loaded / progressEvent.total) * 100;
          progressBar.style.width = `${percent}%`;
          if (percent === 100) {
            message.textContent = 'Đã tải file thành công';
          }
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const image = await uploadAPI.uploadImage(formData, token);
      const video = await axiosClient.post(url, formVideo, config);

      // Add data
      const dataNew = {
        idUser,
        idCategory,
        courseName,
        price,
        "feePercent": 5,
        description,
        videoPreview: video.contentLink,
        thumbnail: image.contentLink,
        discount,
        status
      }
      console.log(dataNew);
      const res = await courseAPI.addCourse(dataNew, token);
      console.log(res);
    } catch (error) {
      console.log(error);
    }

  }
}

(async () => {
  const editor = await ClassicEditor
    .create(document.querySelector('#course-desc'))
    .catch(error => {
      console.error(error);
    });
  handleImageChange();
  handleVideoChange();
  fillCategory();
  const searchParams = new URLSearchParams(window.location.search);
  await handleSave(searchParams, editor);
})()