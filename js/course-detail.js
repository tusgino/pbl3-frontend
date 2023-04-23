import courseAPI from "./api/courseAPI";
import { setSrcContent, setTextContent, toVND } from "./utils";


const rederCourse = (course, id) => {
  if (!course) return;
  console.log(course);
  setTextContent(document, '.hero-title', course.title);
  setTextContent(document, '.price-discount', ` Tiết kiệm -${course.discount}%`);
  setTextContent(document, '.price-old', toVND(course.price));
  setTextContent(document, '.price-new', toVND(course.price - course.price * course.discount / 100));
  setTextContent(document, '.hero-author>span', course.author);
  const videoElement = document.querySelector('.hero-video');
  videoElement.innerHTML = ''
  const videoNew = document.createElement('video');
  videoNew.setAttribute('id', 'player');
  videoNew.setAttribute('playsinline', '');
  videoNew.setAttribute('controls', '');
  videoNew.controls = true;
  videoNew.width = 700;
  const sourceElement = document.createElement("source");
  sourceElement.src = course.videoPreview;
  sourceElement.type = "video/mp4";
  sourceElement.classList.add('video-src');
  videoNew.appendChild(sourceElement);
  videoElement.appendChild(videoNew);
  const register = document.querySelector('.form');
  if (register) {
    register.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email-purchase').value;
      const name = document.getElementById('name-purchase').value;
      window.location.href = `/course/checkout.html?id=${id}&email=${email}&name=${name}`
    })
  }
}

(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const courseId = searchParams.get('id');
    // console.log(courseId);
    if (!courseId)
      window.location.href = '/index.html';
    const course = await courseAPI.getByID({ id: courseId });
    // console.log(course.data);
    rederCourse(course.data, courseId);
  } catch (error) {
    console.log('Failed', error);
  }
})()