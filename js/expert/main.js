const handleImageChange = () => {
  document.getElementById('file-upload').addEventListener('change', function (event) {
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

(() => {
  handleImageChange();
})()