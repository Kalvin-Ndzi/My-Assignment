import { SchoolSystem } from "../models/usermanager.js";
import { Course } from "./Course.js";

// Initialize system manager
const system = new SchoolSystem();

// Restore previously saved courses
const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
storedCourses.forEach(data => {
  const course = new Course(data.courseName, data.code);
  system.addCourse(course);
});

// Save courses to localStorage
function saveCoursesToStorage() {
  const plainCourses = system.courses.map(c => ({
    courseName: c.courseName,
    code: c.code
  }));
  localStorage.setItem("courses", JSON.stringify(plainCourses));
}

// DOM Logic for adding a new course from dynamic overlay
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('.add-course');

  const observer = new MutationObserver(() => {
    const courseForm = container.querySelector('.add-course-form');

    if (courseForm) {
      courseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const input = courseForm.querySelector('input[type="text"]');
        const course_name = input?.value.trim();

        if (course_name) {
          const new_course = new Course(course_name);
          system.addCourse(new_course);
          saveCoursesToStorage();
          input.value = '';
          alert(`Course "${new_course.courseName}" created successfully!`);
        } else {
          alert('Please enter a course name.');
        }
      });
    }
  });

  if (container) {
    observer.observe(container, { childList: true });
  }

  container.innerHTML = '';
  console.log(JSON.parse(localStorage.getItem('courses')));
});
