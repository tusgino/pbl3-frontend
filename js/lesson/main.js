import lessonAPI from "../api/lessonAPI";
import { setSrcContent, setTextContent, showNotication } from "../utils";

const createLessonElement = (chapter, lesson, nextLessons) => {
  if (!lesson) return;
  // console.log(nextLessons);

  const lessonTemplate = document.getElementById('lesson-template');
  if (!lessonTemplate) return;
  const li = lessonTemplate.content.cloneNode(true);
  if (!li) return;
  setTextContent(li, '.lesson-name', `Bài ${lesson.index}: ${lesson.title}`);
  // console.log(lesson);
  if (lesson.status === 1) {
    li.querySelector('.fa-play-circle')?.classList.add('hidden');
    li.querySelector('.fa-check-circle')?.classList.remove('hidden');
  }

  console.log(document.querySelectorAll('.lesson-item.active'));
  if (lesson.status === 0 && document.querySelectorAll('a.active').length === 0) {
    li.querySelector('.lesson-item')?.classList.add('active');
    renderDashboard(lesson.idLesson);
  }
  // console.log(document.querySelectorAll('.lesson-item.active').length);
  const aElement = li.firstElementChild ?? li.querySelector('a');
  if (!aElement) return;
  aElement.dataset.id = lesson.idLesson;
  aElement.dataset.status = lesson.status;
  if (nextLessons)
    aElement.dataset.idNext = nextLessons?.idLesson;
  li.firstElementChild?.addEventListener('click', (event) => {
    event.preventDefault();
    const nextLesson = event.target.closest('.lesson-item').dataset.status;
    const currentLesson = document.querySelector('.lesson-item.active').dataset.status;
    if (nextLesson === '0' && currentLesson === '0') {
      showNotication('Bạn phải hoàn thành bài học trước đó!', 'error');
      return;
    };
    document.querySelector('.lesson-item.active').classList.remove('active');
    event.target.closest('.lesson-item').classList.add('active');
    renderDashboard(lesson.idLesson);
  })
  return li;
}
const createChapterElement = (tabList, chapter, nextChapter) => {
  if (!chapter) return;

  const tabTemplate = document.getElementById('tab-template');
  if (!tabTemplate) return;
  const tab = tabTemplate.content.cloneNode(true);
  if (!tab) return;
  setTextContent(tab, '[data-id="title"]', chapter.name);

  const lessonList = tab.querySelector('.lesson-list');
  console.log(lessonList);
  tabList.appendChild(tab);
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
}


const handleTab = (chapters) => {
  // console.log(chapters);
  if (!Array.isArray(chapters) || chapters.length === 0) return;
  const tabList = document.querySelector('.tab-list');
  if (!tabList) return;
  chapters.forEach((chapter, index) => {
    const nextChapter = chapters[index + 1];
    const tab = createChapterElement(tabList, chapter, nextChapter);
    // if (tab)
    // tabList.appendChild(tab);
  })

}

const createQuizElement = (quiz, id) => {
  if (!quiz) return;
  const quizTemplate = document.getElementById('quiz-template');
  if (!quizTemplate) return;
  const quizElement = quizTemplate.content.cloneNode(true);
  if (!quizElement) return;
  setTextContent(quizElement, '.question-title', `Câu ${id + 1}: ${quiz.question}`);
  if (quiz.image) {
    setSrcContent(quizElement, '.question-image', quiz.image);
  }
  else {
    quizElement.querySelector('.question-image')?.classList.add('hidden');
  }
  const answerList = quizElement.querySelectorAll('.answer-item input');
  if (!answerList) return;
  const answers = [];
  answers.push(quiz.option1);
  answers.push(quiz.option2);
  answers.push(quiz.option3);
  answers.push(quiz.option4);
  answerList.forEach((answerInputs, index) => {
    answerInputs.name = `${quiz.idQuiz}-question-${id + 1}`;
    answerInputs.id = `${quiz.idQuiz} -answer - ${index + 1}`
    answerInputs.nextElementSibling.setAttribute('for', `${quiz.idQuiz} -answer - ${index + 1}`);
    answerInputs.nextElementSibling.textContent = answers[index];
  });
  return quizElement;
}

const renderQuiz = (quizList) => {
  if (!quizList) return;
  const ulElement = document.querySelector('.quiz-list');
  if (!ulElement) return;
  quizList.forEach((quiz, index) => {
    console.log(quiz);
    const quizElement = createQuizElement(quiz, index);
    if (quizElement)
      ulElement.appendChild(quizElement);
  });
  document.querySelector('.btn-quiz').addEventListener('click', () => {
    const ulElement = document.querySelectorAll('.quiz-list .quiz-item');
    if (!ulElement) return;
    let totalCorrect = 0;
    let quizIndex = 0;
    ulElement.forEach((quiz) => {
      const answer = quiz.querySelector('.answer-item input:checked');
      if (!answer) return;
      if (answer.value === `${quizList[quizIndex].answer}`) {
        totalCorrect++;
        quiz.querySelector('.answer-item input:checked + label')?.classList.add('correct');
        quiz.querySelector('.answer-item input:checked + label::after')?.classList.add('correct');
      }
      else {
        quiz.querySelector('.answer-item input:checked + label')?.classList.add('incorrect');
        quiz.querySelector('.answer-item input:checked + label::after')?.classList.add('incorrect');
        quiz.querySelector(`.answer-item input[value="${quizList[quizIndex].answer}"] + label`)?.classList.add('correct');
        quiz.querySelector(`.answer-item input[value="${quizList[quizIndex].answer}"] + label::after`)?.classList.add('correct');
      }
      quizIndex++;
    })
    const totalQuiz = quizList.length;
    showNotication(`Bạn đã trả lời đúng ${totalCorrect}/${totalQuiz} câu hỏi!`, 'success');
  })
}

const renderDashboard = async (idLesson) => {


  const token = localStorage.getItem('token');
  if (!token) return;
  const { data } = await lessonAPI.getLessonByID(idLesson, token);

  console.log(data);

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
  const player = new Plyr('#player', {
    controls: ['play-large', 'play', 'mute', 'volume', 'captions', 'fullscreen'],
    seekTime: 0,
    listeners: {
      seek: (e) => {
        if (e.detail.forward) {
          e.preventDefault();
          return false;
        }
      }
    }
  });

  const updateStatus = async (data, token) => {
    console.log(data);
    const result = await lessonAPI.updateStatus(data, token);
    console.log(result);
  }

  // console.log(data);
  const nextButton = document.querySelector('.next');
  nextButton.classList.add('hidden');
  const liElement = document.querySelector(`[data-id="${idLesson}"]`);
  if (liElement.dataset.status === '1') {
    nextButton.classList.remove('hidden');
  }
  // console.log(player.currentTime);
  document.querySelector('.quiz').classList.add('hidden');
  let check = 1;
  player.on('timeupdate', () => {
    // console.log(player.currentTime);
    // console.log(player.duration);
    if (check) {
      console.log(player.currentTime / player.duration, "-", data.duration / 100);
      if (player.currentTime / player.duration >= data.duration / 100) {
        nextButton.classList.remove('hidden');
        liElement.dataset.status = '1';

        if (data.quizzes.length > 0) {
          renderQuiz(data.quizzes);
          document.querySelector('.quiz').classList.remove('hidden');
        }
        else {
        }

        liElement.querySelector('.fa-play-circle')?.classList.add('hidden');
        liElement.querySelector('.fa-check-circle')?.classList.remove('hidden');

        //call API
        const token = localStorage.getItem('token');
        if (!token) return;
        const searchParams = new URLSearchParams(window.location.search);
        const idUser = searchParams.get('id');
        // console.log(idUser, idLesson);

        const params = {
          idUser,
          idLesson,
        }
        // console.log(params);
        updateStatus(params, token);
        check = 0;
      }
    }
  });
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