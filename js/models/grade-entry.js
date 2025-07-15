// Import the SchoolSystem class (which contains students, courses, enrollments)
import { SchoolSystem } from "./usermanager.js";

// Wait for the DOM to load before initializing
document.addEventListener("DOMContentLoaded", () => {
  const system = new SchoolSystem();
  system.loadFromStorage(); // Load data from localStorage

  // If enrollments are missing, enroll every student into every course
  if (!localStorage.getItem("enrollments")) {
    system.enrollAllStudents();
    system.saveToStorage(); // Save new enrollments
  }

  // DOM elements
  const studentList = document.getElementById("student-list");
  const gradeOverlay = document.getElementById("grade-entry-overlay");
  const courseInputs = document.getElementById("course-inputs");
  const studentNameSpan = document.getElementById("selected-student-name");

  // Helper to find course title from courseCode
  function getCourseTitle(code) {
    const course = system.courses.find(c => c.code === code);
    return course ? course.title : "Course";
  }

  // Renders the student cards dynamically
  system.students.forEach(student => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.dataset.matricule = student.matricule;
    card.innerHTML = `<h3>${student.name}</h3><p>Matricule: ${student.matricule}</p>`;
    
    // Attach click handler to open grading form
    card.addEventListener("click", () => {
      document.querySelectorAll(".student-card").forEach(c => c.removeAttribute("data-active"));
      card.setAttribute("data-active", "true");
      openGradeForm(student);
    });

    studentList.appendChild(card);
  });

  // Opens the grade form modal for a selected student
  function openGradeForm(student) {
    gradeOverlay.classList.remove("hidden");
    studentNameSpan.textContent = student.name;
    courseInputs.innerHTML = ""; // Clear any previous content

    // Get this student's enrollments
    const enrollments = system.getStudentEnrollments(student.matricule);

    enrollments.forEach(enroll => {
      const label = document.createElement("label");
      label.textContent = getCourseTitle(enroll.courseCode);

      const input = document.createElement("input");
      input.classList.add("grade-input");
      input.type = "number"; //to Ensure numeric input
      input.min = "0";
      input.max = "100";
      input.step = "1";
      input.placeholder = `${enroll.courseCode} - ${getCourseTitle(enroll.courseCode)}`;
      input.dataset.courseCode = enroll.courseCode;
      input.value = enroll.score || "";

      courseInputs.appendChild(label);
      courseInputs.appendChild(input);
    });

    // Save button inside the modal
    document.getElementById("save-grades").onclick = () => {
      const inputs = document.querySelectorAll(".grade-input");
      inputs.forEach(input => {
        const code = input.dataset.courseCode;
        const score = parseInt(input.value.trim());
        if (!isNaN(score)) {
          system.updateScore(student.matricule, code, score);
        }
      });
      system.saveToStorage();
      alert("Grades saved successfully!");
      gradeOverlay.classList.add("hidden");
    };
  }

  // Handler to close the overlay when "×" button is clicked
  document.getElementById("close-overlay").addEventListener("click", () => {
    gradeOverlay.classList.add("hidden");
  });
});
