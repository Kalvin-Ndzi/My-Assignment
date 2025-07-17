import { SchoolSystem } from "./usermanager.js";

document.addEventListener("DOMContentLoaded", () => {
  const system = new SchoolSystem();

  // Step 1: Load from localStorage
  system.loadFromStorage();
  system.enrollAllStudents();
  system.saveToStorage();
  console.log("Loaded students:", system.students);
  console.log("Loaded courses:", system.courses);
  console.log("Loaded enrollments from storage:", system.enrollments);

  // Step 2: Check and create enrollments
  if (!localStorage.getItem("enrollments")) {
    console.log("No enrollments found — enrolling all students...");
    system.enrollAllStudents();
    system.saveToStorage();
    console.log("enrollments created:", system.enrollments);
  }

  // Step 3: DOM references
  const studentList = document.getElementById("student-list");
  const gradeOverlay = document.getElementById("grade-entry-overlay");
  const studentNameSpan = document.getElementById("selected-student-name");
  const courseSelect = document.getElementById("course-select");
  const gradeInput = document.getElementById("grade-input");

  // Helper to get course title
  function getCourseTitle(code) {
    const course = system.courses.find(c => c.code === code);
    return course ? course.title : "Course";
  }

  // Step 4: Render student cards
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
  // Step 5: Open grade form and populate dropdown
  function openGradeForm(student) {
    gradeOverlay.classList.remove("hidden");
    studentNameSpan.textContent = student.name;

    courseSelect.innerHTML = "";
    gradeInput.value = "";

    const enrollments = system.getStudentEnrollments(student.matricule);
    console.log("Selected student:", student.name, "| Matricule:", student.matricule);
    console.log("Enrollments for this student:", enrollments);

    enrollments.forEach(enroll => {
      const option = document.createElement("option");
      option.value = enroll.courseCode;
      option.textContent = getCourseTitle(enroll.courseCode);
      courseSelect.appendChild(option);

      console.log("Adding course to dropdown:", enroll.courseCode);
    });

    // Step 6: Save grade on button click
    document.getElementById("save-grade").onclick = () => {
      const selectedCourse = courseSelect.value;
      const score = parseInt(gradeInput.value.trim());

      if (!isNaN(score)) {
        system.updateScore(student.matricule, selectedCourse, score);
        system.saveToStorage();
        alert("Grade saved successfully!");
        gradeOverlay.classList.add("hidden");
      } else {
        alert("Please enter a valid score between 0 and 100.");
      }
    };
  }

  // Step 7: Close overlay on button click
  document.getElementById("close-overlay").addEventListener("click", () => {
    gradeOverlay.classList.add("hidden");
  });
});
