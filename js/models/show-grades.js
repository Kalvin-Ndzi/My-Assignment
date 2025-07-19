import { SchoolSystem } from "./usermanager.js";

document.addEventListener("DOMContentLoaded", () => {
  const system = new SchoolSystem();

  // Load data from localStorage
  system.loadFromStorage();

  // If enrollments are missing, initialize everything
  if (!localStorage.getItem("enrollments")) {
    system.enrollAllStudents();
    system.saveToStorage();
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

  // Helper: Get enrollment score
  function getEnrollmentScore(courseCode, matricule) {
    const record = system.enrollments.find(
      e => e.courseCode === courseCode && e.matricule === matricule
    );
    return record ? record.score : "Not graded";
  }

  // Render all student cards with their grades
  system.students.forEach(student => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.dataset.matricule = student.matricule;

    let html = `<h3>${student.name}</h3>
                <p>Matricule: ${student.matricule}</p>
                <ul class="student-courses">`;

    const enrollments = system.getStudentEnrollments(student.matricule);
    enrollments.forEach(enroll => {
      const courseName = getCourseTitle(enroll.courseCode);
      const score = enroll.score !== null ? enroll.score : "Not graded";
      html += `<li>${courseName} (${enroll.courseCode}): <strong>${score}</strong></li>`;
    });

    html += `</ul>`;
    card.innerHTML = html;

    console.log(enrollments);

    card.addEventListener("click", () => {
      openGradeForm(student);
    });

    studentList.appendChild(card);
  });

  // Grade form logic
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

    // Show the current grade for the selected course
    courseSelect.addEventListener("change", () => {
      const selectedCourse = courseSelect.value;
      const score = getEnrollmentScore(selectedCourse, student.matricule);
      gradeInput.value = score !== "Not graded" ? score : "";
    });

    courseSelect.dispatchEvent(new Event("change"));

    document.getElementById("save-grade").onclick = () => {
      const selectedCourse = courseSelect.value;
      const score = parseInt(gradeInput.value.trim());

      if (!isNaN(score)) {
        system.updateScore(student.matricule, selectedCourse, score);
        system.saveToStorage();
        alert("Grade saved successfully!");
        gradeOverlay.classList.add("hidden");
        location.reload(); // Refresh to show new score
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
