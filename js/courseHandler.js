import { Student } from "./models/student.js";
import { SchoolSystem } from "./models/usermanager.js";
export const showAddCourseForm = () => {
  const htmlContent = `<div class="add-new-course">
      <h2>Add a Course</h2>
      <form action="" class="add-course-form">
        <input type="text" placeholder="Course-title">
        <input type="submit">
      </form>
    </div>`;
  const courseAdder = document.querySelector('.add-course');
  courseAdder.innerHTML = htmlContent;
};


