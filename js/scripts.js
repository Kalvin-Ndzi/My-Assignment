import { showAddCourseForm } from './courseHandler.js';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.course-add')?.addEventListener('click', (e) => {
    e.preventDefault();
    showAddCourseForm();
  });
});
