import accountAPI from "./api/accountAPI";
import courseAPI from "./api/courseAPI";
import userAPI from "./api/userAPI";
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

  liElement.firstElementChild?.addEventListener('click', async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('token');
    const idCourse = course.id
    const idUser = localStorage.getItem('idUser')
    const params = {
      id: idUser,
    }
    // console.log(params);
    const { data } = await courseAPI.getByIDUser(params, token);
    // console.log(data);
    if (data.length !== 0) {
      console.log(data);
      let cnt = 0;
      data.forEach(course => {
        if (course.id === idCourse) {
          window.location.href = `/lesson/index.html?id=${idUser}&course=${idCourse}`;
          cnt++;
          return;
        }
      });
      if (cnt == 0) {
        window.location.assign(`/course/detail.html?id=${course.id}`);
      }
    }
    else {
      window.location.assign(`/course/detail.html?id=${course.id}`);
    }
  })

  return liElement;
}

const renderCourse = (courseList) => {

  // console.log(typeof (courseList));
  // console.log(courseList.length);
  if (!Array.isArray(courseList) || courseList.length === 0) return;
  const ulElement = getPostList();
  if (!ulElement) return;
  courseList.forEach((course) => {
    const liElement = createCourseElement(course);
    // console.log(liElement);
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

    const page = Number(++ulElement.dataset.page);
    const limit = 6;
    const totalPage = Number(ulElement.dataset.totalPage);

    if (page > totalPage) return;

    try {
      const params = {
        page,
        limit
      };

      const { data: { data, pagination } } = await courseAPI.getAll(params);
      console.log(data);
      renderCourse(data);
      renderPagination(pagination);

    } catch (error) {
      console.log('Error from get posts', error);
    }
  });
}


const getPosts = async () => {

  initMoreCourse();

  try {
    const params = {
      page: 1,
      limit: 6,
    };
    const { data: { data, pagination } } = await courseAPI.getAll(params);
    // console.log(data);
    // console.log(pagination);
    renderCourse(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('Error from get posts', error);
  }
}

const renderUIRole = async (role, token) => {
  const btn_login = document.querySelector(".btn-login");
  if (!btn_login) return;
  const params = {
    id: role.idUser,
  }
  localStorage.setItem('idUser', role.idUser)
  try {
    const { data } = await userAPI.getByID(params, token);
    if (window.location.pathname == '/') {
      showNotication(`Chào mừng ${data.name} quay trở lại 🙌`);
    }
    const avatar = document.querySelector('.nav-avatar');
    if (avatar) {
      avatar.src = data.avatar;
    }
    if (btn_login) {
      if (role.role == 'Expert') {
        btn_login.textContent = 'Quản lí khóa học';
        btn_login.addEventListener('click', () => {
          window.location.href = `/expert/index.html?id=${role.idUser}&page=courses`;
        });
        const order = document.querySelector('.nav-order');
        console.log('hello');
        if (order) {
          order.style.display = 'none';
        }
        if (avatar)
          avatar.addEventListener('click', () => {
            window.location.href = `/expert/index.html?id=${role.idUser}&page=profile`;
          })
      }
      if (role.role == 'Admin') {
        btn_login.textContent = 'Quản lí hệ thống';
        btn_login.addEventListener('click', () => {
          window.location.href = "/admin/system.html";
        })
        if (avatar)
          avatar.addEventListener('click', () => {
            window.location.href = `/admin/profile.html?id=${role.idUser}&page=profile`;
          })
      }
      if (role.role == 'Student') {
        btn_login.textContent = 'Khu vực học tập';
        btn_login.addEventListener('click', () => {
          window.location.href = `/profile.html?id=${role.idUser}&page=learning`;
        });
        if (avatar)
          avatar.addEventListener('click', () => {
            window.location.href = `/profile.html?id=${role.idUser}&page=profile`;
          })
      }
    }
    const namePurchase = document.getElementById('name-purchase');
    const emailPurchase = document.getElementById('email-purchase');
    if (namePurchase && emailPurchase) {
      emailPurchase.setAttribute('disabled', '');
      namePurchase.setAttribute('disabled', '');
      namePurchase.value = data.name;
      emailPurchase.value = data.email;
      emailPurchase.dataset.idUser = data.idUser;
    }
  } catch (error) {
    console.log(error);
  }

}

const checkToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  const data = {
    "token": token,
  }
  // console.log(params);
  try {
    const res = await accountAPI.checkToken(data);
    // console.log(res.data);
    if (res.success) {
      renderUIRole(res.data, token)
    }
  } catch (error) {
    console.log(error);
  }
}

const renderExpert = () => {

}

(async () => {
  checkToken();
  getPosts();
})()