import courseAPI from "./api/courseAPI";
import { getPostList, setSrcContent, setTextContent } from "./utils";

const createCourseElement = (course) => {
  if (!course) return;

  const courseTemplate = document.getElementById('courseTemplate');
  if (!courseTemplate) return;

  const liElement = courseTemplate.content.cloneNode(true);
  if (!liElement) return;


  setTextContent(liElement, '[data-id="title"]', course.title);
  setTextContent(liElement, '[data-id="name"]', course.nameUser);

  setSrcContent(liElement, '[data-id="thumbnail"]', course.thumbnail);
  setSrcContent(liElement, '[data-id="avatar"]', course.avatarUser);

  liElement.firstElementChild?.addEventListener('click', () => {
    console.log('hello');
    window.location.assign(`/course/detail.html?id=${course.id}`);
  })

  return liElement;
}

const renderCourse = (courseList) => {

  if (!Array.isArray(courseList) || courseList.length === 0) return;
  const ulElement = getPostList();
  if (!ulElement) return;
  courseList.forEach((course) => {
    const liElement = createCourseElement(course);
    if (liElement) {
      ulElement.appendChild(liElement);
    }
  });
}

const renderPagination = (pagination) => {

  if (!pagination) return;

  const { _page, _limit, _totalRows } = pagination;
  const totalPage = Math.ceil(_totalRows / _limit);

  if (_page >= totalPage) {
    const buttonMore = document.querySelector('.course-more');
    if (!buttonMore) return;
    buttonMore.style.display = 'none';
  }

  const ulElement = getPostList();
  if (!ulElement) return;

  ulElement.dataset.page = _page;
  ulElement.dataset.totalPage = totalPage;
}

const initMoreCourse = () => {
  const buttonMore = document.querySelector('.course-more');
  if (!buttonMore) return;

  buttonMore.addEventListener('click', async () => {
    const ulElement = getPostList();
    if (!ulElement) return;

    const _page = Number(ulElement.dataset.page) + 1;
    const _limit = 9;
    const _totalPage = Number(ulElement.dataset.totalPage);

    if (_page > _totalPage) return;

    try {
      const params = {
        _page,
        _limit,
      };
      const { data, pagination } = await courseAPI.getAll(params);
      renderPagination(pagination);
      renderCourse(data);
    } catch (error) {
      console.log('Error from get posts', error);
    }
  });
}


const getPosts = async () => {

  initMoreCourse();

  try {
    const params = {
      _page: 1,
      _limit: 9,
    };
    const { data: { data, pagination } } = await courseAPI.getAll(params);
    console.log(data);
    console.log(pagination);
    renderCourse(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('Error from get posts', error);
  }
}

(async () => {
  getPosts();
})()