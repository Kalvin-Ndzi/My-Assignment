import { SchoolSystem } from "./models/usermanager.js";
import { Course } from "./models/Course.js";

const system = new SchoolSystem();

// Load from localStorage
const loadFromStorage = () => {
  const loadData = (key, action) => {
    const items = JSON.parse(localStorage.getItem(key)) || [];
    items.forEach(action);
  };

  loadData("users", ({ name, password }) => system.addUser({ name, password }));
  loadData("courses", ({ courseName, code }) => system.addCourse(new Course(courseName, code)));
  loadData("students", ({ name, matricule }) => system.addStudent({ name, matricule }));

  console.log("Loaded Courses:", system.courses);
};

const saveCoursesToStorage = () => {
  const simpleCourses = system.courses.map(c => ({
    courseName: c.courseName,
    code: c.code || ""
  }));
  localStorage.setItem("courses", JSON.stringify(simpleCourses));
};

const renderCourses = () => {
  const container = document.querySelector('#course-card-container');
  container.innerHTML = '';

  console.log(system.courses)

  system.courses.forEach(course => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <h3>${course.courseName}</h3>
      <p>Instructor: Not assigned</p>
      <p>Schedule: TBD</p>
      <div class="things">
        <div class="somethx">0</div>
        <div class="somethx">
          <button class="edit-btn" data-code="${course.code}">Edit</button>
        </div>
        <div class="somethx">
          <button class="delete-btn" data-code="${course.code}">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  attachEditListeners();
  attachDeleteListeners();
};

const attachEditListeners = () => {
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
      const courseCode = button.getAttribute('data-code');
      const course = system.courses.find(c => c.code === courseCode);
      if (!course) return;

      const card = button.closest('.card');
      card.innerHTML = `
        <form class="edit-course-form">
          <input type="text" value="${course.courseName}" class="edit-name" />
          <button type="submit">Save</button>
          <button type="button" class="cancel-edit">Cancel</button>
        </form>
      `;

      const form = card.querySelector('.edit-course-form');
      form.addEventListener('submit', e => {
        e.preventDefault();
        const newName = card.querySelector('.edit-name').value.trim();
        if (newName) {
          course.courseName = newName;
          saveCoursesToStorage();
          renderCourses();
        } else {
          alert('Course name cannot be empty.');
        }
      });

      card.querySelector('.cancel-edit').addEventListener('click', () => {
        renderCourses();
      });
    });
  });
};

const attachDeleteListeners = () => {
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      const courseCode = button.getAttribute('data-code');
      const course = system.courses.find(c => c.code === courseCode);
      if (!course) return;

      const confirmDelete = confirm(`Are you sure you want to delete "${course.courseName}"?`);
      if (confirmDelete) {
        system.courses = system.courses.filter(c => c.code !== courseCode);
        saveCoursesToStorage();
        renderCourses();
      }
    });
  });
};

const sa_course = (course_name) => {
  if (system.courses.find(c => c.courseName === course_name)) {
    return { success: false, message: "Course already exists" };
  }
  const newCourse = new Course(course_name);
  system.addCourse(newCourse);
  saveCoursesToStorage();
  renderCourses();
  return { success: true, message: "Course Registered" };
};

const htmlContent = `
  <form class="coursename-form">
    <input type="text" id="cname" placeholder="Course Name" required />
    <input type="submit" value="Add Course" />
  </form>
`;

document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  renderCourses();

  const LogoutBtn = document.querySelector('.logout');
  LogoutBtn.addEventListener('click', () => {
    window.location.href = '../html/index.html';
  });

  const AddBtn = document.querySelector('.course-add');
  AddBtn.addEventListener('click', () => {
    const courseForm = document.querySelector('.add-course');
    courseForm.innerHTML = htmlContent;

    const actualForm = courseForm.querySelector('.coursename-form');
    const coursename = actualForm.querySelector('#cname');

    actualForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const course_name = coursename.value.trim();
      const result = sa_course(course_name);
      alert(result.message);
      renderCourses();
      courseForm.innerHTML = '';
    });
  });
});


console.log(JSON.parse(localStorage.getItem('CurrentUser')));
console.log(JSON.parse(sessionStorage.getItem('logged-in')));