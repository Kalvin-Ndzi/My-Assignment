import { SchoolSystem } from "./usermanager.js";
import { Course } from "./Course.js";
import { Student } from "./student.js";

//User class definition
export class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
}

//this scripts run only when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  //DOM Elements for authentication
  const SignUpBtn = document.querySelector(".signup");
  const LoginBtn = document.querySelector(".login");
  const NameInput = document.querySelector(".uname");
  const PwdInput = document.querySelector(".upwd");
  const NameLoginInput = document.querySelector(".ulogin-name");
  const PwdLoginInput = document.querySelector(".ulogin-pwd");

  //Initialize School System & Load from LocalStorage
  const system = new SchoolSystem();

  //Retrieve users & rebuild user objects
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  storedUsers.forEach((data) => {
    const user = new User(data.name, data.password);
    system.addUser(user);
  });

  //Retrieve and rebuild courses
  const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
  storedCourses.forEach((data) => {
    const course = new Course(data.name, data.code);
    system.addCourse(course);
  });

  //Retrieve and rebuild students
  const storedStudents = JSON.parse(localStorage.getItem("students")) || [];
  storedStudents.forEach((data) => {
    const student = new Student(data.name, data.matricule,); // 
    system.addStudent(student);
  });

  //Helper function: Register new user
  function registerUser(name, password) {
    const existingUser = system.users.find((u) => u.name === name);
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }
    const newUser = new User(name, password);
    system.addUser(newUser);

    const plainUsers = system.users.map((u) => ({
      name: u.name,
      password: u.password,
    }));
    localStorage.setItem("users", JSON.stringify(plainUsers));
    return { success: true, message: "Registration successful" };
  }

  //Sign-Up Logic
  if (SignUpBtn && NameInput && PwdInput) {
    SignUpBtn.addEventListener("submit", (e) => {
      alert("You are about to sign up");
      e.preventDefault();

      const user_name = NameInput.value.trim();
      const user_password = PwdInput.value.trim();

      const result = registerUser(user_name, user_password);
      alert(result.message);

      if (result.success) {
        NameInput.value = "";
        PwdInput.value = "";
        window.location.href = "../html/index.html";
      }
    });
  }

  //Login Logic
  if (LoginBtn && NameLoginInput && PwdLoginInput) {
    LoginBtn.addEventListener("submit", (e) => {
      alert("You are about to login");
      e.preventDefault();

      const user_name = NameLoginInput.value.trim();
      const user_password = PwdLoginInput.value.trim();

      const foundUser = system.findUser(user_name, user_password);
      if (foundUser) {
        sessionStorage.setItem("logged-in-user", JSON.stringify(foundUser));
        alert("You are now logged in");
        window.location.href = "../html/courses.html";
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });
  }

  //Show logged-in user in console
  console.log(
    "Current session user:",
    JSON.parse(sessionStorage.getItem("logged-in-user"))
  );
  console.log(localStorage.getItem('users'))
});

