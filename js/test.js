document.getElementById('file-upload-form').addEventListener('submit', function (event) {
  event.preventDefault();
  var fileInput = document.getElementById('file-upload');
  var file = fileInput.files[0];

  var formData = new FormData();
  formData.append('file', file);

  // Gọi API từ phía máy khách (sử dụng axios, fetch, hoặc XMLHttpRequest)
  // để upload file và xử lý phản hồi từ server
  // Ví dụ:
  axios.post('/api/upload', formData)
    .then(function (response) {
      // Xử lý phản hồi thành công
      console.log('File uploaded:', response.data);
      // Do something with the response data
    })
    .catch(function (error) {
      // Xử lý phản hồi lỗi
      console.error('File upload failed:', error);
      // Do something with the error
    });
});