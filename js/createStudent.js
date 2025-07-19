import { Student } from "./models/student.js";
import { SchoolSystem } from "./models/usermanager.js";


const system = new SchoolSystem();

//get already saed students
const students = JSON.parse(localStorage.getItem("students")) || [];

students.forEach(data => {
  const new_student = new Student(data.name, data.matricule);
  system.addStudent(new_student);
});

//add a student to storage
function saveStudentsToStorage() {
  const plainStudents = system.students.map(s => ({
    name: s.name,
    matricule: s.matricule
  }));
  localStorage.setItem("students", JSON.stringify(plainStudents));
}

const attachDeleteListeners = () => {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach((button)=> {
    button.addEventListener('click', () => {
      const matricule = button.getAttribute('data-matricule');
      system.students = system.students.filter(s => s.matricule !== matricule);
      saveStudentsToStorage();
      renderStudents(); // Refresh the display
    });
  });
};

const attachEditListeners = () => {
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const matricule = button.getAttribute('data-matricule');
      const student = system.students.find(s => s.matricule === matricule);
      if (!student) return;

      const card = button.closest('.card');
      card.innerHTML = `
        <form class="edit-student-form">
          <input type="text" value="${student.name}" class="edit-name">
          <input type="text" value="${student.matricule}" class="edit-mat">
          <button type="submit">Save</button>
          <button type="button" class="cancel-edit">Cancel</button>
        </form>
      `;

      const form = card.querySelector('.edit-student-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = card.querySelector('.edit-name').value.trim();
        const newMatricule = card.querySelector('.edit-mat').value.trim();

        if (newName && newMatricule) {
          student.name = newName;
          student.matricule = newMatricule;
          saveStudentsToStorage();
          renderStudents();
        } else {
          alert('Both fields are required.');
        }
      });

      card.querySelector('.cancel-edit').addEventListener('click', () => {
        renderStudents(); // Restore original card view
      });
    });
  });
};


export const renderStudents = () => {
  const container = document.querySelector('#student-card-container');
  container.innerHTML = '';

  system.students.forEach(student => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <h3>${student.name}</h3>
      <p>Matricule: ${student.matricule || 'Unknown'}</p>
      <p>Class: TBD</p>
      <div class="things">
        <div class="somethx">—</div>
        <div class="somethx">
        <button class="edit-btn" data-matricule="${student.matricule}">Edit</button>
        </div>
        <div class="somethx">
          <button class="delete-btn" data-matricule="${student.matricule}">Delete</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  attachDeleteListeners(); // Attach listeners right after rendering
  attachEditListeners();
  // renderStudents();
};


//now logic to displa form
document.addEventListener("DOMContentLoaded", () => {
  renderStudents();
  const btn = document.querySelector('.register-student');
  const htmlContent =  `<div class="add-new-course">
    <h2>Add a Student</h2>
    <form action="" class="createstud-form">
      <input type="text" placeholder="Student name" class="in-name">
      <input type="submit">
    </form>
  </div>`
  if (btn) {
    btn.addEventListener('click', () => {
      console.log("Button clicked!");
    document.querySelector('.add-stud').innerHTML = htmlContent;
    //once form has been renderd i try to get the form so i can get the input init
    const StudentCreationForm = document.querySelector('.createstud-form');
  if (StudentCreationForm) {
    StudentCreationForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const StudnameInput = document.querySelector('.in-name');
      const stud_name = StudnameInput?.value.trim();

      if (stud_name) {
        const new_student = new Student(stud_name);
        system.addStudent(new_student);
        saveStudentsToStorage();
        console.log(JSON.parse(localStorage.getItem('students')));
        renderStudents();
        alert('Student created successfully!');
        document.querySelector('.add-stud').innerHTML = '';
      } else {
        alert('Please enter a name for the student.');
      }
    });
  } else {
    console.log('Student creation form not found in DOM.');
  }
    });
  } else {
    console.warn("Button not found in DOM.");
  }
});
console.log(system.students);
console.log(JSON.parse(localStorage.getItem('students')));

