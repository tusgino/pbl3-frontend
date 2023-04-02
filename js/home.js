import courseAPI from "./api/courseAPI";
import { setSrcContent, setTextContent } from "./utils/common";

const createCourseElement = (course) => {
  if (!course) return;

  const courseTemplate = document.getElementById('courseTemplate');
  if (!courseTemplate) return;

  const liElement = courseTemplate.content.cloneNode(true);
  if (!liElement) return;


  setTextContent(liElement, '[data-id="title"]', course.title);
  setTextContent(liElement, '[data-id="name"]', course.author);

  setSrcContent(liElement, '[data-id="thumbnail"]', course.imageUrl);
  setSrcContent(liElement, '[data-id="avatar"]', course.imageUrl);

  return liElement;
}

const renderCourse = (courseList) => {

  if (!Array.isArray(courseList) || courseList.length === 0) return;
  const ulElement = document.getElementById('list-courses');
  if (!ulElement) return;
  courseList.forEach((course) => {
    const liElement = createCourseElement(course);
    if (liElement) {
      ulElement.appendChild(liElement);
    }
  });
}


const getPosts = async () => {
  try {
    const params = {
      _page: 1,
      _limit: 10,
    };
    const { data } = await courseAPI.getAll(params);
    renderCourse(data);
  } catch (error) {
    console.log('Error from get posts', error);
  }
}

(async () => {
  getPosts();
})()