import courseAPI from "../api/courseAPI";
import purchaseAPI from "../api/pucharseAPI";
import { setTextContent, showNotication, toVND } from "../utils";

const checkToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/index.html';
  }
}

const renderCourse = async (searchParams) => {
  const idCourse = searchParams.get('id');
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const { data } = await courseAPI.getByID({ id: idCourse });
  console.log(data);
  const course = document.querySelector('.course-info');
  const confirm = document.querySelector('.confirm');
  setTextContent(course, '.course-title', data.title);
  setTextContent(course, '.price-old', toVND(data.price));
  setTextContent(course, '.price-new', toVND(data.price - data.price * data.discount / 100));
  setTextContent(confirm, '.price-old', toVND(data.price));
  setTextContent(confirm, '.price-new', toVND(data.price - data.price * data.discount / 100));
  console.log(`${data.discount}% (${toVND(data.price * data.discount / 100)})`);
  setTextContent(confirm, '.discount-text', `${data.discount}% (${toVND(data.price * data.discount / 100)})`);
  setTextContent(confirm, '.name>span', name);
  setTextContent(confirm, '.email>span', email);

  const payment = document.getElementById('payment-info');
  if (!payment) return;

  setTextContent(payment, '.banking-amount>span', toVND(data.price - data.price * data.discount / 100));
  setTextContent(payment, '.content>span', email);

  document.querySelector('.banking-copy').addEventListener('click', () => {
    const contentCopy = document.querySelector('.content>span').innerText;
    navigator.clipboard.writeText(contentCopy)
      .then(() => {
        showNotication('Đã sao chép nội dung');
      })
      .catch((error) => {
        showNotication(`Lỗi khi sao chép nội dung: ${error}`, 'error');
      });
  })
}

const handleSubmit = (searchParams) => {
  const idCourse = searchParams.get('id');
  const email = searchParams.get('email');


  // console.log(idCourse);
  // console.log(email);

  const submitPurchase = async (data, token) => {
    const res = await purchaseAPI.purchaseStudent(data, token);
    console.log(res);
  }

  document.querySelector('.submit-course').addEventListener('click', () => {
    const payment = document.querySelector('input[name="payment-option"]:checked');
    if (payment.dataset.id !== '3') {
      showNotication('Phương thức thanh toán đang bảo trì!', 'error');
      return;
    }

    const token = localStorage.getItem('token');

    const data = {
      idCourse,
      email,
      "typeOfPurchase": 3,
    }

    const paymentModal = new bootstrap.Modal(document.getElementById('payment-info'));
    paymentModal.show();


    showNotication('Đăng kí thành công, vui lòng thanh toán');

    submitPurchase(data, token);


    // const res = purchaseAPI.purchaseStudent(data, token);

    // console.log(res);

    // console.log(data);
  });
  // console.log(payment.dataset.id);


  // console.log(payment);
}

(() => {
  checkToken();
  const searchParams = new URLSearchParams(window.location.search);
  renderCourse(searchParams);
  handleSubmit(searchParams);
})()