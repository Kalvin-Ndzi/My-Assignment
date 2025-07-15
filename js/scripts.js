import { showAddCourseForm } from './courseHandler.js';

document.querySelector('.course-add').addEventListener('click', (e) => {
  e.preventDefault();
  showAddCourseForm();
})