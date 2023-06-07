import courseAPI from "./api/courseAPI";
import { getPostList, setSrcContent, setTextContent, showNotication } from "./utils";

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
    window.location.assign(`/course/detail.html?id=${course.id}`);
  })

  return liElement;
}

const renderCourse = (courseList) => {
    // const ulElement = getPostList();
    // if (!ulElement) return;
    // ulElement.textContent = "";

    const dataview = document.querySelector('.courses-container');
    if(!dataview) return;
    dataview.textContent = "";
    
    if (!Array.isArray(courseList) || courseList.length === 0) return;

    const ulElement = document.createElement('ul');
    ulElement.id = 'list-courses'

    courseList.forEach((course) => {
        const liElement = createCourseElement(course);
        if (liElement) {
            ulElement.appendChild(liElement);
        }
    });
    dataview.appendChild(ulElement);
}

const createPage = (pagenum, func) => {
    const liElement = document.createElement('li');
    liElement.classList.add("page-item");
    liElement.style.fontSize = "25px"

    liElement.innerHTML = `<span class="page-link">${pagenum}</span>`
    
    liElement.addEventListener('click', async() => {
        func(pagenum);
    })
    return liElement;
}
const renderPagination  = (totalRows, func, pagechosen) => {
    const ulElement = document.createElement('ul');
    ulElement.classList.add("pagination");
    ulElement.classList.add("justify-content-center");
    ulElement.classList.add("gap-2");
    const totalPage = Math.ceil(totalRows / 9);
    for(let i = 1; i <= totalPage; ++i) {
        const liElement = createPage(i, func);
        if(i == pagechosen) liElement.classList.add('active');
        ulElement.appendChild(liElement);
    }
    const dataview = document.querySelector('.courses-container');
    dataview.appendChild(ulElement);
}

const getPosts = async (page) => {


  try {

    const txtsearch = document.getElementById('title-course');

    const params = {
      page,
      limit: 9,
      title_like: txtsearch.value,
    };
    const { data: { data, pagination } } = await courseAPI.getAll(params);
    console.log(data);
    console.log(pagination);
    renderCourse(data);
    renderPagination(pagination._totalRows, getPosts, page);
  } catch (error) {
    console.log('Error from get posts', error);
  }
}

const handleTextChange = async() => {
    const txtsearch = document.getElementById('title-course');
    txtsearch.addEventListener('input', () => {
        getPosts(1);
    })
}

(async() => {
    getPosts(1);    
    
    handleTextChange();
    
    


})()