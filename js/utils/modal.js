export const showModal = (title, message) => {
  const titleModal = document.querySelector('.modal-title');
  if (!titleModal) return;
  titleModal.textContent = title;
  const bodyModal = document.querySelector('.modal-body');
  if (!bodyModal) return;
  bodyModal.textContent = message;
  const myModal = new bootstrap.Modal(document.getElementById('myModal'));
  myModal.show();
}