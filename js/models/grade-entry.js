import { SchoolSystem } from "./usermanager.js";

document.addEventListener("DOMContentLoaded", () => {
  const system = new SchoolSystem();

  // Load saved data
  system.loadFromStorage();
  system.enrollAllStudents();
  
  // Create dummy data if needed
  if (!localStorage.getItem("enrollments")) {
    console.log("No enrollments found — enrolling all students...");
    system.enrollAllStudents();
    system.saveToStorage();
    console.log("Enrollments created:", system.enrollments);
  }

  // DOM elements
  const studentList = document.getElementById("student-list");
  const gradeOverlay = document.getElementById("grade-entry-overlay");
  const studentNameSpan = document.getElementById("selected-student-name");
  const courseSelect = document.getElementById("course-select");
  const gradeInput = document.getElementById("grade-input");

  // Helper: Get course title
  function getCourseTitle(code) {
    const course = system.courses.find(c => c.code === code);
    return course ? course.courseName : "Course";
  }

  // Helper: Get grade from enrollment
  function getEnrollmentScore(courseCode, matricule) {
    const enrollment = system.enrollments.find(
      e => e.courseCode === courseCode && e.matricule === matricule
    );
    return enrollment && enrollment.score !== null ? enrollment.score : "";
  }

  // Render student cards with name and matricule only
  system.students.forEach(student => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.dataset.matricule = student.matricule;
    card.innerHTML = `<h3>${student.name}</h3><p>Matricule: ${student.matricule}</p>`;

    card.addEventListener("click", () => {
      openGradeForm(student);
    });

    studentList.appendChild(card);
  });

  // Grade modal logic
  function openGradeForm(student) {
    gradeOverlay.classList.remove("hidden");
    studentNameSpan.textContent = student.name;
    courseSelect.innerHTML = "";
    gradeInput.value = "";

    const enrollments = system.getStudentEnrollments(student.matricule);

    enrollments.forEach(enroll => {
      const option = document.createElement("option");
      option.value = enroll.courseCode;
      option.textContent = getCourseTitle(enroll.courseCode);
      courseSelect.appendChild(option);
    });

    // Show score when course is selected
    courseSelect.addEventListener("change", () => {
      const selectedCourse = courseSelect.value;
      const score = getEnrollmentScore(selectedCourse, student.matricule);
      gradeInput.value = score;
    });

    // Trigger initial score display
    courseSelect.dispatchEvent(new Event("change"));

    // Save grade on button click
    document.getElementById("save-grade").onclick = () => {
      const selectedCourse = courseSelect.value;
      const score = parseInt(gradeInput.value.trim());

      if (!isNaN(score) && score >= 0 && score <= 100) {
        system.updateScore(student.matricule, selectedCourse, score);
        system.saveToStorage();
        alert("Grade saved successfully!");
        gradeOverlay.classList.add("hidden");
        location.reload(); // Optional: refresh to reflect changes visually
      } else {
        alert("Please enter a valid score between 0 and 100.");
      }
    };
  }

  // Close modal
  document.getElementById("close-overlay").addEventListener("click", () => {
    gradeOverlay.classList.add("hidden");
  });
});
