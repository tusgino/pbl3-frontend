import lessonAPI from "../api/lessonAPI";
import { setTextContent } from "../utils";

const createLessonElement = (chapter, lesson, nextLessons) => {
  if (!lesson) return;
  // console.log(nextLessons);

  const lessonTemplate = document.getElementById('lesson-template');
  if (!lessonTemplate) return;
  const li = lessonTemplate.content.cloneNode(true);
  if (!li) return;
  setTextContent(li, '.lesson-name', `Bài ${lesson.index}: ${lesson.title}`);
  if (chapter.index == 1 && lesson.index == 1) {
    li.querySelector('.lesson-item')?.classList.add('active');
    renderDashboard(lesson.idLesson);
  }
  const aElement = li.firstElementChild ?? li.querySelector('a');
  if (!aElement) return;
  aElement.dataset.id = lesson.idLesson;
  if (nextLessons)
    aElement.dataset.idNext = nextLessons?.idLesson;
  li.firstElementChild?.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.lesson-item.active').classList.remove('active');
    event.target.closest('.lesson-item').classList.add('active');
    renderDashboard(lesson.idLesson);
  })
  return li;
}
const createChapterElement = (chapter, nextChapter) => {
  if (!chapter) return;

  const tabTemplate = document.getElementById('tab-template');
  if (!tabTemplate) return;
  const tab = tabTemplate.content.cloneNode(true);
  if (!tab) return;
  setTextContent(tab, '[data-id="title"]', chapter.name);
  const lessonList = tab.querySelector('.lesson-list');
  if (!lessonList) return;
  chapter.lessons.forEach((lesson, index) => {
    let nextLessons = chapter.lessons[index + 1];
    if (nextLessons === undefined && nextChapter !== undefined) {
      nextLessons = nextChapter.lessons[0];
    }
    // console.log(nextLessons);
    const lessonElement = createLessonElement(chapter, lesson, nextLessons);
    if (lessonElement)
      lessonList.appendChild(lessonElement);
  });

  return tab;
}


const handleTab = (chapters) => {
  // console.log(chapters);
  if (!Array.isArray(chapters) || chapters.length === 0) return;
  const tabList = document.querySelector('.tab-list');
  if (!tabList) return;
  chapters.forEach((chapter, index) => {
    const nextChapter = chapters[index + 1];
    const tab = createChapterElement(chapter, nextChapter);
    if (tab)
      tabList.appendChild(tab);
  })

}

const renderDashboard = async (idLesson) => {
  console.log(idLesson);


  const token = localStorage.getItem('token');
  if (!token) return;
  const { data } = await lessonAPI.getLessonByID(idLesson, token);

  document.getElementById('main').innerHTML = "";
  const contentTemplate = document.getElementById('content-lesson');
  if (!contentTemplate) return;
  const content = contentTemplate.content.cloneNode(true);
  if (!content) return;
  setTextContent(content, '.title', `Bài ${data.index}: ${data.title}`);
  const videoTemplate = document.getElementById('video-template');
  if (!videoTemplate) return;
  const video = videoTemplate.content.cloneNode(true);
  if (!video) return;
  video.querySelector('.video-src').src = data.video;
  content.querySelector('.video').appendChild(video);
  content.querySelector('.desc').innerHTML = data.desc;
  document.getElementById('main').appendChild(content);
  const player = new Plyr('#player');
  handleDashboard();
}

const handleDashboard = () => {
  const nextButton = document.querySelector('.next');
  const currentLesson = document.querySelector('.lesson-item.active');
  if (!nextButton || !currentLesson) return;
  if (currentLesson.dataset.idNext) {
    nextButton.addEventListener('click', (event) => {
      event.preventDefault();
      const nextLesson = document.querySelector(`[data-id="${currentLesson.dataset.idNext}"]`);
      if (!nextLesson) return;
      nextLesson.click();
    });
  }
  else {
    nextButton.classList.add('hidden');
  }
}

const renderUI = async (idUser, token, idCourse) => {
  const params = {
    idCourse,
    idUser,
  }
  const { data } = await lessonAPI.getAllLesson(params, token);

  handleTab(data.chapters);
}


(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const idUser = searchParams.get('id');
  const token = localStorage.getItem('token');
  const idCourse = searchParams.get('course');
  renderUI(idUser, token, idCourse);
})()