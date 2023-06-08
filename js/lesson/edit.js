import axiosClient from "../api/axiosClient";
import chapterAPI from "../api/chapterAPI";
import courseAPI from "../api/courseAPI";
import lessonAPI from "../api/lessonAPI";
import quizAPI from "../api/quizAPI";
import uploadAPI from "../api/uploadAPI";
import { showNotication } from "../utils";


const handleAddChapter = (idCourse, chapters, token) => {
  const saveChapter = document.querySelector('#chapterModal .btn-save');
  const ChapterModal = new bootstrap.Modal(document.getElementById('chapterModal'));
  console.log(ChapterModal);
  saveChapter.addEventListener('click', async () => {

    if (!document.getElementById('chapter-name').value) {
      showNotication('Vui lòng thêm tên chương', 'error');
      return;
    }

    if (document.getElementById('chapterModal').dataset.id) {
      const dataNew = []
      if (document.getElementById('chapter-name').value !== chapters.options[chapters.selectedIndex].text.split(': ')[1]) {
        dataNew.push({
          "op": "replace",
          "path": "Name",
          "value": `${chapters.options[chapters.selectedIndex].text.split(': ')[0]}: ${document.getElementById('chapter-name').value}`
        });
      }
      if (dataNew.length === 0) {
        showNotication('Không có gì thay đổi', 'error');
        return;
      }
      console.log(dataNew);
      try {
        const res = await chapterAPI.updateChapter(document.getElementById('chapterModal').dataset.id, dataNew, token);
        console.log(res);
        if (res.success) {
          showNotication('Cập nhật chương thành công!');
          chapters.options[chapters.selectedIndex].text = `${chapters.options[chapters.selectedIndex].text.split(': ')[0]}: ${document.getElementById('chapter-name').value}`;
        }
      }
      catch (error) {
        console.log(error);
      }
      finally {
        setTimeout(() => {
          window.location = location;
        }, 1500)
      }
    }
    else {
      const nameChapter = `Chương ${chapters.options.length}: ${document.getElementById('chapter-name').value}`;
      const data = {
        "name": nameChapter,
        "index": chapters.options.length,
        "idCourse": idCourse,
      };
      console.log(data);
      try {
        const res = await chapterAPI.addChapter(data, token);
        console.log(res);
        if (res.success) {
          showNotication('Thêm chương thành công!');
          const option = document.createElement('option');
          option.value = res.data?.idChapter;
          option.innerText = nameChapter;
          chapters.appendChild(option);
          ChapterModal.hide();
        }
      } catch (error) {
        console.log(error);
      }
    }

  });


  // console.log(saveChapter);
}


const setError = (error, message) => {
  const Element = document.querySelector(error);
  if (!Element) return

  Element.classList.add('message')

  Element.querySelector('.message').innerText = message
}

const clearError = (error) => {
  const Element = document.querySelector(error);
  if (!Element) return

  if (Element.classList.contains('message')) {
    Element.classList.remove('message')
    Element.querySelector('.message').innerText = ''
  }

}

const handleChange = () => {
  const changeName = document.querySelector('.detail-name')
  const changeDuration = document.querySelector('.detail-duration')

  changeName.addEventListener('input', () => {
    clearError('.detail-name')
  })

  changeDuration.addEventListener('input', () => {
    clearError('.detail-duration')
  })

}


const handleClickEvent = (editor) => {
  // Edit Chapter
  const editChapterBtn = document.querySelector('.chapter-action .action-edit');
  const addChapterBtn = document.querySelector('.chapter-action .action-add');

  const token = localStorage.getItem('token');
  console.log(editChapterBtn);
  const ChapterModal = new bootstrap.Modal(document.getElementById('chapterModal'));
  const chapter = document.getElementById('chapter');
  const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
  addChapterBtn.addEventListener('click', () => {
    document.getElementById('chapterModal').dataset.id = '';
    document.getElementById('chapter-name').value = '';
  });
  editChapterBtn.addEventListener('click', () => {
    if (chapter.value === 'default') {
      showNotication('Vui lòng chọn chương để chỉnh sửa', 'error');
      return;
    }
    ChapterModal.show();
    document.getElementById('chapterModal').dataset.id = chapter.value;
    document.getElementById('chapter-name').value = chapter.options[chapter.selectedIndex].text.split(': ')[1];
  });
  document.querySelector('#chapterModal .btn-cancel').addEventListener('click', () => {
    ChapterModal.hide();
  });
  document.querySelector('#chapterModal .btn-close').addEventListener('click', () => {
    ChapterModal.hide();
  });


  const removeChapterBtn = document.querySelector('.chapter-action .action-remove');
  removeChapterBtn.addEventListener('click', () => {
    if (chapter.value === 'default') {
      showNotication('Vui lòng chọn chương để xóa', 'error');
      return;
    }

    confirmModal.show();
  });

  document.querySelector('#confirmModal .btn-cancel').addEventListener('click', async () => {

    if (document.querySelector('#confirmModal').dataset.idQuiz) {
      try {
        const res = await quizAPI.deleteQuiz(document.querySelector('#confirmModal').dataset.idQuiz, token);
        if (res.success) {
          confirmModal.hide();
          showNotication('Xóa bài tập thành công!');
          document.querySelector('#confirmModal').dataset.idQuiz = '';
        }
      } catch (error) {
        console.log(error);
      }
      finally {
        confirmModal.hide();
        setTimeout(() => {
          window.location = location;
        }, 1500);
      }
      return;
    }

    if (document.querySelector('#confirmModal').dataset.idLesson) {
      try {
        const res = await lessonAPI.deleteLesson(document.querySelector('#confirmModal').dataset.idLesson, token);
        if (res.success) {
          confirmModal.hide();
          showNotication('Xóa bài giảng thành công!');
          document.querySelector('#confirmModal').dataset.idLesson = '';
        }
      } catch (error) {
        console.log(error);
      }
      finally {
        confirmModal.hide();
        setTimeout(() => {
          window.location = location;
        }, 1500);
      }
      return;
    }

    try {
      if (chapter.value !== 'default') {
        const result = await chapterAPI.deleteChapter(chapter.value, token);
        if (result.success) {
          confirmModal.hide();
          showNotication('Xóa chương thành công!');
          chapter.removeChild(chapter.options[chapter.selectedIndex]);
        }
      }
      else {
        showNotication('Vui lòng chọn chương để xóa', 'error');
        return;
      }
    } catch (error) {
      showNotication('Vui lòng thử lại', 'error');
      console.log(error);
    }
  });



  // Edit Lesson
  const editLessonBtn = document.querySelector('.lesson-action .action-edit');
  const addLessonBtn = document.querySelector('.lesson-action .action-add');
  const lessonContent = document.querySelector('.lesson-content');
  const lesson = document.getElementById('lesson');

  addLessonBtn.addEventListener('click', () => {
    if (chapter.value === 'default') {
      showNotication('Vui lòng chọn chương để thêm bài giảng!', 'error');
      return;
    }
    if (lessonContent.classList.contains('hidden')) {
      lessonContent.classList.remove('hidden');
    }
    editor.setData('');
    document.getElementById('lesson-name').value = '';
    document.getElementById('file-video').src = '';
    document.getElementById('lesson-duration').value = '';
    document.getElementById('file-video').classList.add('hidden');
    document.getElementById('video-drag').classList.remove('invalid');
    document.getElementById('video-drag').style.border = "2px dashed #404040";


    lesson.value = 'default';
    document.querySelector('.lesson-content').dataset.id = '';

    if (document.querySelector('.btn-action .btn-save').classList.contains('hidden'))
      document.querySelector('.btn-action .btn-save').classList.remove('hidden');
  });

  editLessonBtn?.addEventListener('click', () => {
    if (lesson.value === 'default') {
      showNotication('Vui lòng chọn bài học để chỉnh sửa', 'error');
      return;
    }
    if (document.querySelector('.btn-action .btn-save').classList.contains('hidden'))
      document.querySelector('.btn-action .btn-save').classList.remove('hidden');
  });

  const removeLessonBtn = document.querySelector('.lesson-action .action-remove');
  removeLessonBtn.addEventListener('click', () => {
    if (lesson.value === 'default') {
      showNotication('Vui lòng chọn bài giảng để xóa', 'error');
      return;
    }
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    document.getElementById('confirmModal').dataset.idLesson = document.querySelector('.lesson-content').dataset.id;
    confirmModal.show();
  });
}

const renderInfo = async (searchParams, editor) => {
  const idCourse = searchParams.get('id');
  if (!idCourse) return;
  const token = localStorage.getItem('token');
  if (!token) return;
  const { data } = await courseAPI.getInfoCourse(idCourse, token);
  console.log(data);
  const chapters = document.getElementById('chapter');
  if (data) {
    data.forEach(chapter => {
      const option = document.createElement('option');
      option.value = chapter.idChapter;
      option.innerText = chapter.name;
      chapters.appendChild(option);
    })
  }

  handleAddChapter(idCourse, chapters, token);

  const lessons = document.getElementById('lesson');
  chapters.addEventListener('change', () => {
    const idChapter = chapters.value;
    if (!idChapter) return;
    lessons.innerHTML = '';
    const option = document.createElement('option');
    option.value = 'default';
    option.innerText = `- Chọn bài giảng -`;
    lessons.appendChild(option);
    data.forEach(chapter => {
      if (chapter.idChapter === idChapter) {
        chapter.lessons.forEach((lesson, index) => {
          const option = document.createElement('option');
          option.value = lesson.idLesson;
          option.innerText = `Bài ${index + 1}: ${lesson.title}`;
          lessons.appendChild(option);
        })
      }
    })
  });

  lessons.addEventListener('change', async () => {

    if (lessons.value === 'default' || !lessons.value)
      return;

    const lessonContent = document.querySelector('.lesson-content');
    if (lessonContent.classList.contains('hidden')) {
      lessonContent.classList.remove('hidden');
    }
    if (document.querySelector('.btn-action .btn-save').classList.contains('hidden'))
      document.querySelector('.btn-action .btn-save').classList.remove('hidden');

    const { data } = await lessonAPI.getLessonByID(lessons.value, token);
    console.log(data);
    document.getElementById('lesson-name').value = data.title;
    lessonContent.dataset.title = data.title;
    document.getElementById('lesson-duration').value = data.duration;
    lessonContent.dataset.duration = data.duration;
    editor.setData(data.desc);
    lessonContent.dataset.description = data.desc;
    const video = document.getElementById('file-video');
    document.getElementById('video-upload').value = null;
    const progressBar = document.querySelector('.progress');
    progressBar.style.width = `${0}%`;
    document.querySelector('.message').textContent = ''
    video.src = data.video;
    video.dataset.video = data.video;
    lessonContent.dataset.video = data.video
    document.querySelector('.lesson-content').dataset.id = lessons.value;
    if (video.classList.contains('hidden')) {
      video.classList.remove('hidden');
    }
    document.getElementById('video-drag').classList.add('invalid');
    document.getElementById('video-drag').style.border = "0px";
    if (data.quizzes.length != 0) {
      // Clone template
      const quizTemplate = document.getElementById('quiz-template');
      const quizList = document.querySelector('.quiz-list');
      quizList.innerHTML = '';
      data.quizzes.forEach((quiz, index) => {
        const clone = quizTemplate.content.cloneNode(true);
        clone.querySelector('.item-heading').textContent = `Câu ${index + 1}: ${quiz.question}`;
        clone.querySelector('.quiz-item').dataset.id = quiz.idQuiz;
        clone.querySelector('.action-edit').addEventListener('click', (event) => {
          const quizModalForm = document.getElementById('quizModal');
          quizModalForm.dataset.id = event.target.parentElement?.parentElement?.dataset.id;
          quizModalForm.querySelector('#quiz-question').value = `${quiz.question}`;
          quizModalForm.querySelector('#file-image').dataset.image = quiz.image ?? '';
          quizModalForm.querySelector('#file-image').src = quiz.image ?? '';
          if (quizModalForm.querySelector('#file-image').classList.contains('hidden') && quiz.image) {
            quizModalForm.querySelector('#file-image').classList.remove('hidden');
            quizModalForm.querySelector('#file-drag').style.border = '0px';
          }
          quizModalForm.querySelector('#quiz-answer-a').value = quiz.option1;
          quizModalForm.querySelector('#quiz-answer-b').value = quiz.option2;
          quizModalForm.querySelector('#quiz-answer-c').value = quiz.option3;
          quizModalForm.querySelector('#quiz-answer-d').value = quiz.option4;
          quizModalForm.querySelector('#quiz-answer-correct').value = `${quiz.answer}`;
          const quizModal = new bootstrap.Modal(quizModalForm);
          quizModal.show();
        });
        clone.querySelector('.action-remove').addEventListener('click', (event) => {
          const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
          document.getElementById('confirmModal').dataset.idQuiz = event.target.parentElement?.parentElement?.dataset.id;
          confirmModal.show();
        });
        quizList.appendChild(clone);
      });
    }
  });
  handleQuiz(data);
}

const handleVideoChange = () => {
  const fileUpload = document.getElementById('video-upload');
  const videoPreview = document.getElementById('file-video');
  const videoDrag = document.getElementById('video-drag');
  const token = localStorage.getItem('token');

  fileUpload.addEventListener('change', async (event) => {
    console.log('video');
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      videoPreview.src = event.target.result;
      videoPreview.classList.remove('hidden');
      if (!videoDrag.classList.contains('invalid'))
        videoDrag.classList.add('invalid');
    };
    fileReader.readAsDataURL(file);
    document.querySelector('#video-drag').style.border = "0px";

    //Upload Video
    const formVideo = new FormData();
    formVideo.append('file', file);
    const progressBar = document.querySelector('.progress');
    const message = document.querySelector('.message');
    message.textContent = 'Đang tải...';
    try {
      const url = `/Upload/upload`;
      const config = {
        onUploadProgress: (progressEvent) => {
          const percent = (progressEvent.loaded / progressEvent.total) * 100;
          // progressBar.style.width = `${percent}%`;
          // if (percent === 100) {
          //   message.textContent = 'Đã tải file thành công';
          // }
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const video = await axiosClient.post(url, formVideo, config);

      if (video.contentLink) {
        progressBar.style.width = `${100}%`;
        message.textContent = 'Đã tải file thành công';
      }
      videoPreview.dataset.video = video.contentLink;
    } catch (error) {
      console.log(error);
    }
  });



};

const handleImageChange = () => {
  document.getElementById('file-upload').addEventListener('change', async (event) => {
    console.log('image');
    var file = event.target.files[0];
    var fileReader = new FileReader();

    fileReader.onload = function (event) {
      var imagePreview = document.getElementById('file-image');
      imagePreview.src = event.target.result;
      imagePreview.classList.remove('hidden');
    };
    fileReader.readAsDataURL(file);
    document.getElementById('file-drag').style.border = "0px";
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const formData = new FormData();
      formData.append('file', file);
      const image = await uploadAPI.uploadImage(formData, token);

      // document.getElementById('image').value = data.url;
      const imagePreview = document.getElementById('file-image');
      imagePreview.dataset.image = image.contentLink;
      console.log(image.contentLink);
      showNotication('Ảnh đã được tải lên');
    } catch (error) {
      console.log(error);
    }
  });
}

const handleQuiz = (data) => {
  console.log(data);
  const addQuizBtn = document.querySelector('.quiz-action .action-add');
  const quizModalForm = document.getElementById('quizModal');
  const quizModal = new bootstrap.Modal(quizModalForm);
  const lessons = document.getElementById('lesson');
  const chapter = document.getElementById('chapter');
  const addQuiz = document.querySelector('#quizModal .btn-save');
  // console.log(addQuiz);
  const token = localStorage.getItem('token');
  if (!token) return;

  addQuizBtn.addEventListener('click', () => {
    if (lessons.value === 'default') {
      showNotication('Vui lòng chọn bài giảng để thêm câu hỏi', 'error');
      return;
    }
    quizModalForm.dataset.id = '';
    document.getElementById('quiz-question').value = '';
    document.getElementById('file-image').src = '';
    document.getElementById('file-image').dataset.image = '';
    document.getElementById('file-image').classList.add('hidden');
    document.getElementById('quiz-answer-a').value = '';
    document.getElementById('quiz-answer-b').value = '';
    document.getElementById('quiz-answer-c').value = '';
    document.getElementById('quiz-answer-d').value = '';
    document.getElementById('quiz-answer-correct').value = '1';
    quizModal.show();
  });



  addQuiz.addEventListener('click', async () => {
    const question = document.getElementById('quiz-question').value;
    const imagePreview = document.getElementById('file-image');
    const answerA = document.getElementById('quiz-answer-a').value;
    const answerB = document.getElementById('quiz-answer-b').value;
    const answerC = document.getElementById('quiz-answer-c').value;
    const answerD = document.getElementById('quiz-answer-d').value;
    const correctAnswer = document.getElementById('quiz-answer-correct').value;
    const idLesson = lessons.value;

    // Update Quiz
    if (quizModalForm.dataset.id) {
      // showNotication('update quiz');
      console.log('update');
      const dataNew = [];
      let quiz;
      data.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          lesson.quizzes.forEach(quizChange => {
            if (quizChange.idQuiz === quizModalForm.dataset.id) {
              quiz = quizChange;
            }
          })
        })
      });

      if (quiz.question !== question) {
        dataNew.push({
          "op": "replace",
          "path": "Question",
          "value": question,
        });
      }
      if (quiz.option1 !== answerA) {
        dataNew.push({
          "op": "replace",
          "path": "Option1",
          "value": answerA,
        });
      }
      if (quiz.option2 !== answerB) {
        dataNew.push({
          "op": "replace",
          "path": "Option2",
          "value": answerB,
        });
      }
      if (quiz.option3 !== answerC) {
        dataNew.push({
          "op": "replace",
          "path": "Option3",
          "value": answerC,
        });
      }
      if (quiz.option4 !== answerD) {
        dataNew.push({
          "op": "replace",
          "path": "Option4",
          "value": answerD,
        });
      }
      if (quiz.answer !== parseInt(correctAnswer)) {
        dataNew.push({
          "op": "replace",
          "path": "Answer",
          "value": parseInt(correctAnswer),
        });
      }
      if (quiz.image !== imagePreview.dataset.image) {
        dataNew.push({
          "op": "replace",
          "path": "Image",
          "value": imagePreview.dataset.image,
        });
      }
      console.log(dataNew);
      if (dataNew.length === 0) {
        showNotication('Không có gì thay đổi');
        return;
      }
      try {
        console.log(dataNew);
        const res = await quizAPI.updateQuiz(quiz.idQuiz, dataNew, token);
        console.log(res);
        showNotication('Cập nhật câu hỏi thành công!');

        setTimeout(() => {
          window.location = location;
        }, 1500);
      } catch (error) {
        console.log(error);
        showNotication('Vui lòng thử lại', 'error');
      }
      finally {
        quizModal.hide();
        return;
      }
    }
    // Add Quiz
    const quiz = {
      idLesson,
      question,
      image: imagePreview.dataset.image ?? '',
      option1: answerA,
      option2: answerB,
      option3: answerC,
      option4: answerD,
      answer: parseInt(correctAnswer)
    };

    try {
      console.log(quiz);
      const { data } = await quizAPI.addQuiz(quiz, token);
      showNotication('Thêm câu hỏi thành công!');

      const quizTemplate = document.getElementById('quiz-template');
      const quizList = document.querySelector('.quiz-list');
      const count = quizList.querySelectorAll('li').length;
      console.log(count);
      const clone = quizTemplate.content.cloneNode(true);
      clone.querySelector('.item-heading').textContent = `Câu ${count + 1}: ${data.question}`;
      clone.querySelector('.quiz-item').dataset.id = data.idQuiz;
      clone.querySelector('.action-edit').addEventListener('click', (event) => {
        const quizModalForm = document.getElementById('quizModal');
        quizModalForm.dataset.id = event.target.parentElement?.parentElement?.dataset.id;
        quizModalForm.querySelector('#quiz-question').value = `${data.question}`;
        quizModalForm.querySelector('#file-image').dataset.image = data.image ?? '';
        quizModalForm.querySelector('#file-image').src = data.image ?? '';
        if (quizModalForm.querySelector('#file-image').classList.contains('hidden') && data.image) {
          quizModalForm.querySelector('#file-image').classList.remove('hidden');
          quizModalForm.querySelector('#file-drag').style.border = '0px';
        }
        quizModalForm.querySelector('#quiz-answer-a').value = data.option1;
        quizModalForm.querySelector('#quiz-answer-b').value = data.option2;
        quizModalForm.querySelector('#quiz-answer-c').value = data.option3;
        quizModalForm.querySelector('#quiz-answer-d').value = data.option4;
        quizModalForm.querySelector('#quiz-answer-correct').value = `${data.answer}`;
        const quizModal = new bootstrap.Modal(quizModalForm);
        quizModal.show();
      });
      quizList.appendChild(clone);

    } catch (error) {
      console.log(error);
    }
    finally {
      quizModal.hide();
    }
  });
}


const handleLesson = (editor) => {

  const addLessonBtn = document.querySelector('.btn-action .btn-save');
  const chapter = document.getElementById('chapter');
  const lessons = document.getElementById('lesson');
  let count = 0;
  addLessonBtn.addEventListener('click', async () => {

    const token = localStorage.getItem('token');
    if (!token) {
      showNotication('Vui lòng đăng nhập', 'error');
      return;
    }
    if (chapter.value === 'default') {
      showNotication('Vui lòng chọn chương', 'error');
      // return;
      count++
    }

    if (!document.getElementById('lesson-name').value) {
      // showNotication('Vui lòng nhập tên bài học', 'error');
      setError('.detail-name', 'Vui lòng nhập tên bài học')
      // return;
      count++
    }

    if (!document.getElementById('file-video').dataset.video) {
      showNotication('Vui lòng chọn video', 'error');
      // return;
      count++
    }

    if (!parseInt(document.getElementById('lesson-duration').value)) {
      // showNotication('Vui lòng nhập thời lượng bài học', 'error');
      setError('.detail-duration', 'Vui lòng nhập thời lượng bài học')
      // return;
      count++
    }

    if (count > 0)
      return
    const idLesson = document.querySelector('.lesson-content').dataset.id;

    if (idLesson) {
      // showNotication('update');
      // return;
      // Update lesson
      const dataNew = []

      if (document.getElementById('lesson-name').value !== document.querySelector('.lesson-content').dataset.title) {
        dataNew.push({
          "op": "replace",
          "path": "Title",
          "value": document.getElementById('lesson-name').value,
        });
      }

      if (editor.getData() !== document.querySelector('.lesson-content').dataset.description) {
        dataNew.push({
          "op": "replace",
          "path": "Description",
          "value": editor.getData(),
        });
      }

      if (document.getElementById('file-video').dataset.video !== document.querySelector('.lesson-content').dataset.video) {
        dataNew.push({
          "op": "replace",
          "path": "Video",
          "value": document.getElementById('file-video').dataset.video,
        });
      }

      if (parseInt(document.getElementById('lesson-duration').value) !== parseInt(document.querySelector('.lesson-content').dataset.duration)) {
        dataNew.push({
          "op": "replace",
          "path": "Duration",
          "value": parseInt(document.getElementById('lesson-duration').value),
        });
      }

      if (dataNew.length > 0) {
        try {
          const res = await lessonAPI.updateLesson(idLesson, dataNew, token);
          console.log(res);
          if (res.success) {
            showNotication('Cập nhật bài giảng thành công');
            setTimeout(() => {
              window.location = location;
            }, 1500);
          }
        } catch (error) {
          console.log(error);
          showNotication('Vui lòng thử lại', 'error');
        }
      }
      return;
    }


    const lesson = {
      idChapter: chapter.value,
      title: document.getElementById('lesson-name').value,
      description: editor.getData() ?? '',
      video: document.getElementById('file-video').dataset.video,
      index: lessons.options.length,
      duration: parseInt(document.getElementById('lesson-duration').value),
    }
    // console.log(lesson);

    console.log(lesson);
    try {
      const res = await lessonAPI.addLesson(lesson, token);
      console.log(res);
      if (res.success) {
        showNotication('Thêm bài giảng thành công');
        setTimeout(() => {
          window.location = location;
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      showNotication('Vui lòng thử lại', 'error');
    }

  });
}

(async () => {
  const editor = await ClassicEditor
    .create(document.querySelector('#lesson-desc'))
    .catch(error => {
      console.error(error);
    });
  const searchParams = new URLSearchParams(window.location.search);
  handleClickEvent(editor);
  handleVideoChange();
  handleImageChange();
  renderInfo(searchParams, editor);
  handleLesson(editor);
  handleChange();
})()