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
  const videoHidden = document.querySelector('.video-icon');
  const videoPreview = document.getElementById('file-video');
  if (!videoHidden) return;

  videoHidden.addEventListener('click', () => {
    if (videoPreview.classList.contains('hidden')) {
      // If the video preview is currently hidden, show it
      videoPreview.classList.remove('hidden');
      videoHidden.classList.remove('fa-eye');
      videoHidden.classList.add('fa-eye-slash');
    } else {
      // If the video preview is currently visible, hide it
      videoPreview.classList.add('hidden');
      videoHidden.classList.remove('fa-eye-slash');
      videoHidden.classList.add('fa-eye');
    }
  });

  fileUpload.addEventListener('change', function (event) {
    console.log('video');
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      videoPreview.src = event.target.result;
      videoPreview.classList.remove('hidden');
    };

    fileReader.readAsDataURL(file);
    document.querySelector('#video-drag').style.border = "0px";
  });
};


const fillCategory = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data: { _data } } = await categoryAPI.getAll({
      page: 1,
      _title_like: '',
    }, token);
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
  if (!token) return;
  const idUser = searchParams.get('idUser');
  if (!idUser) return;
  const detailForm = document.querySelector('.detail-form');
  if (!detailForm) return;
  const btnSave = document.querySelector('.btn-save');
  if (!btnSave) return;
  btnSave.onclick = async () => {
    const idCategory = getValueForm(detailForm, '#category');

    if (idCategory === 'default') {
      showNotication('Vui lòng chọn danh mục', 'error');
      return;
    }

    const courseName = getValueForm(detailForm, '#course-name');
    if (courseName === '') {
      showNotication('Vui lòng nhập tên khóa học', 'error');
      return;
    }

    const price = getValueForm(detailForm, '#course-price');
    if (!parseInt(price)) {
      showNotication('Vui lòng nhập giá tiền', 'error');
      return;
    }

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
      // console.log(res);
      if (res.success) {
        document.querySelector('.detail-lesson').classList.remove('hidden');
        document.querySelector('.detail-lesson .btn-add').addEventListener('click', () => {
          window.location = '/expert/edit.html?id=' + res.data;
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const fillFormCourse = async (searchParams, editor) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  const idCourse = searchParams.get('id');
  if (!idCourse) return;
  const detailForm = document.querySelector('.detail-form');
  if (!detailForm) return;
  //fill Form
  try {
    const { data } = await courseAPI.getByID({ id: idCourse });
    console.log(data);
    detailForm.querySelector('#course-name').value = data.courseName;
    editor.setData(data.description);
    detailForm.querySelector('#course-price').value = data.price;
    detailForm.querySelector('#course-discount').value = data.discount;
    detailForm.querySelector('#category').value = data.category?.idCategory;
    document.getElementsByName('status').value = data.status;
    document.querySelector('#file-image').src = data.thumbnail;
    document.querySelector('#file-image').classList.remove('hidden');
    document.querySelector('#file-video').classList.remove('hidden');
    document.querySelector('#file-video').src = data.videoPreview;


    const btnSave = document.querySelector('.btn-save');
    if (!btnSave) return;
    btnSave.onclick = async () => {
      const idCategory = getValueForm(detailForm, '#category');
      const courseName = getValueForm(detailForm, '#course-name');
      const price = getValueForm(detailForm, '#course-price');
      const discount = getValueForm(detailForm, '#course-discount');
      const status = getStatusValue('status');
      const img = document.querySelector('#file-image').src;
      const videoNew = document.querySelector('#file-video').src;

      const dataNew = [];

      if (idCategory !== data.category.idCategory) {
        dataNew.push({
          "op": "replace",
          "path": "IdCategory",
          "value": idCategory,
        });
      };

      if (courseName !== data.courseName) {
        dataNew.push({
          "op": "replace",
          "path": "CourseName",
          "value": courseName,
        });
      }
      if (`${price}` !== data.price) {
        dataNew.push({
          "op": "replace",
          "path": "Price",
          "value": price,
        });
      }

      if (`${discount}` !== data.discount) {
        dataNew.push({
          "op": "replace",
          "path": "Discount",
          "value": discount,
        });
      }

      if (`${status}` !== data.status) {
        dataNew.push({
          "op": "replace",
          "path": "Status",
          "value": status,
        });
      }


      if (img !== data.thumbnail) {
        const fileInput = document.getElementById('file-upload');
        if (!fileInput) return;
        const file = fileInput.files[0];
        if (!file) {
          showNotication('Vui lòng tải ảnh', 'error');
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
          const image = await uploadAPI.uploadImage(formData, token);
          dataNew.push(
            {
              "op": "replace",
              "path": "Thumbnail",
              "value": image.contentLink,
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      if (videoNew !== data.videoPreview) {
        const videoInput = document.getElementById('video-upload');
        if (!videoInput) return;
        const video = videoInput.files[0];
        if (!video) {
          showNotication('Vui lòng tải Video', 'error');
        }
        const formVideo = new FormData();
        formVideo.append('file', video);
        const progressBar = document.querySelector('.progress');
        const message = document.querySelector('.message');
        message.textContent = 'Đang tải...';
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
          const video = await axiosClient.post(url, formVideo, config);
          dataNew.push(
            {
              "op": "replace",
              "path": "Thumbnail",
              "value": video.contentLink,
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      // console.log(dataNew);
      const res = await courseAPI.updateCourse(data.idCourse, dataNew, token);
      console.log(res);
    };
  } catch (error) {
    console.log(error);
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
  if (searchParams.get('id')) {
    // Update Course
    document.querySelector('.detail-lesson>.btn').innerText = 'Chỉnh sửa bài giảng';
    document.querySelector('.detail-desc').innerText = 'Chuyên gia có thể chỉnh sửa khóa học của mình';
    document.querySelector('.detail-lesson>.btn').addEventListener('click', () => {
      window.location = '/expert/edit.html?id=' + searchParams.get('id');
    });
    await fillFormCourse(searchParams, editor);
  } else {
    // Add new course

    document.querySelector('.detail-lesson').classList.add('hidden');
    // console.log('hello');  

    await handleSave(searchParams, editor);
  }
})()