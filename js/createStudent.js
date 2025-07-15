import { Student } from "./models/student.js";
import { SchoolSystem } from "./models/usermanager.js";


const system = new SchoolSystem();

//get already saed students
const students = JSON.parse(localStorage.getItem("students")) || [];

students.forEach(data => {
  new_student = new Student(data.name, data.matricule);
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

//now logic to displa form
document.addEventListener("DOMContentLoaded", () => {
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

