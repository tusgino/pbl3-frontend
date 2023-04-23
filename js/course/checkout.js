import courseAPI from "../api/courseAPI";
import { setTextContent, toVND } from "../utils";

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
}

(() => {
  checkToken();
  const searchParams = new URLSearchParams(window.location.search);
  renderCourse(searchParams);
})()