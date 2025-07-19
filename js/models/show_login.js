// Imports & Class Definitions
import { SchoolSystem } from "./usermanager.js";
import { Course } from "./Course.js";
import { Student } from "./student.js";

export class User {
  constructor(name, password) {
    this.name = name;
    this.password = password;
  }
}

// Initialize system
const system = new SchoolSystem();

const loadFromStorage = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach(data => system.addUser(new User(data.name, data.password)));

  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  courses.forEach(data => system.addCourse(new Course(data.name, data.code)));

  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach(data => system.addStudent(new Student(data.name, data.matricule)));

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Current user:", currentUser?.name || "None");
};
loadFromStorage();

// Form Template
const htmlContent = `
  <form id="auth-form" class="auth-form-show">
    <input type="text" name="auth_username" placeholder="Username" class="uname" required />
    <div id="username-error"></div>
    <input type="password" name="auth_password" placeholder="Password" class="upwd" required />
    <div id="password-error"></div>
    <input type="submit" id="auth-submit" value="Continue" />
  </form>
`;

const uinput = document.querySelector('.user-input');
uinput?.classList.add('hide');

// Helpers
const validate_username = username => /^[^\s]{3,}$/.test(username);
const validate_password = password =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/.test(password);

// Core Actions
const registerUser = (name, password) => {
  if (system.users.find(u => u.name === name)) {
    return { success: false, message: "User already exists" };
  }
  const newUser = new User(name, password);
  system.addUser(newUser);
  localStorage.setItem("users", JSON.stringify(system.users.map(u => ({
    name: u.name,
    password: u.password
  }))));
  localStorage.setItem("currentUser", JSON.stringify({ name }));
  sessionStorage.setItem("logged-in", JSON.stringify({ name }));
  return { success: true, message: "Registration successful" };
};

const loginUser = (name, password) => {
  const user = system.users.find(u => u.name === name && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify({ name }));
    sessionStorage.setItem("logged-in", JSON.stringify({ name }));
    alert("Login successful!");
    window.location.href = "../../html/courses.html";
  } else {
    alert("Invalid username or password.");
  }
};

const hideForm = () => {
  const formContainer = document.querySelector('.auth-form');
  formContainer?.classList.add('hide');
};

// DOM Bindings
document.addEventListener("DOMContentLoaded", () => {
  const AuthFormContainer = document.querySelector('.auth-form');
  const SignupBtn = document.querySelector('#show-signup');
  const LoginBtn = document.querySelector('#show-login');
  const topic = document.querySelector('.heading');

  const loadForm = (type) => {
    topic.textContent = type === "signup" ? "SignUp" : "Login";
    AuthFormContainer.innerHTML = htmlContent;
    AuthFormContainer.classList.add('login-form-show');
    AuthFormContainer.classList.remove('auth-form-hide');

    const actualForm = document.querySelector("#auth-form");
    const UsernameInput = actualForm.querySelector('.uname');
    const UserPasswordInput = actualForm.querySelector('.upwd');
    const UsernameError = actualForm.querySelector('#username-error');
    const UserPasswordError = actualForm.querySelector('#password-error');

    UsernameInput.addEventListener('input', () => {
      const username = UsernameInput.value.trim();
      UsernameError.textContent = validate_username(username)
        ? ""
        : "Username must be at least 3 characters long and contain no spaces.";
      UsernameError.style.color = "red";
    });

    UserPasswordInput.addEventListener('input', () => {
      const password = UserPasswordInput.value.trim();
      UserPasswordError.textContent = validate_password(password)
        ? "Password is strong"
        : "Password must include uppercase, lowercase, digit, and special character.";
      UserPasswordError.style.color = validate_password(password) ? "green" : "red";
    });

    actualForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user_name = UsernameInput.value.trim();
      const user_password = UserPasswordInput.value.trim();

      if (type === "signup") {
        const result = registerUser(user_name, user_password);
        alert(result.message);
        if (result.success) {
          actualForm.reset();
          hideForm();
        }
      } else if (type === "login") {
        loginUser(user_name, user_password);
      }
    });
  };

  SignupBtn?.addEventListener("click", e => {
    e.preventDefault();
    uinput?.classList.remove('hide');
    loadForm("signup");
  });

  LoginBtn?.addEventListener("click", e => {
    e.preventDefault();
    uinput?.classList.remove('hide');
    loadForm("login");
  });
});

// Debug session user
console.log("Logged-in session user:", JSON.parse(sessionStorage.getItem('logged-in'))?.name || "None");
