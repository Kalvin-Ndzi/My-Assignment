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

// Form HTML Template
const htmlContent = `
  <form id="auth-form" class="auth-form-show">
    <input type="text" name="auth_username" placeholder="Username" class="uname" required />
    <div id="username-error"></div>
    <input type="password" name="auth_password" placeholder="Password" class="upwd" required />
    <div id="password-error"></div>
    <input type="submit" id="auth-submit" value="Continue" />
  </form>
`;

// Initialize system
const system = new SchoolSystem();

// Load stored data into system
const loadFromStorage = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach(data => system.addUser(new User(data.name, data.password)));

  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  courses.forEach(data => system.addCourse(new Course(data.name, data.code)));

  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach(data => system.addStudent(new Student(data.name, data.matricule)));

  console.log("Users loaded from storage:", system.users);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Current session user:", currentUser?.name || "None");
};
loadFromStorage();

// Validation Helpers
const validate_username = username => /^[^\s]+$/.test(username);
const validate_password = password =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/.test(password) &&
  !password.includes(' ');

// Registration Logic
const registerUser = (name, password) => {
  if (system.users.find(u => u.name === name)) {
    return { success: false, message: "User already exists" };
  }
  const newUser = new User(name, password);
  system.addUser(newUser);
  console.log("In registerUser: system.users =", system.users);
  localStorage.setItem("users", JSON.stringify(system.users.map(u => ({
    name: u.name,
    password: u.password
  }))));
  localStorage.setItem("currentUser", JSON.stringify({ name }));
  console.log("Users after registration:", system.users);
  return { success: true, message: "Registration successful" };
};

// Login Logic
const loginUser = (name, password) => {
  hideForm()
  uinput.classList.add('hide');
  const user = system.users.find(u => u.name === name && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify({ name }));
    alert("Login successful!");
    window.location.href = "../html/index.html";
  } else {
    alert("Invalid username or password.");
  }
  window.location.href = '../../html/courses.html'
};

const hideForm = () => {
    const formContainer = document.querySelector('.auth-form');
    formContainer.classList.add('hide');
}

const uinput = document.querySelector('.user-input');
uinput.classList.add('hide');

// DOM Event Bindings
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
      if(username.length < 3){
        UsernameError.innerText = "Username should be at least 3 characters long";
        UsernameError.style.color = "red";
      } else {
        UsernameError.innerText = '';
      }
    });

    UserPasswordInput.addEventListener('input', () => {
      const userpassword = UserPasswordInput.value.trim();
      if(userpassword.length < 8){
        UserPasswordError.innerText = 'Password length cannot be less than 8 characters';
        UserPasswordError.style.color = 'red';
      } else if (!/[a-z]/.test(userpassword)) {
        UserPasswordError.textContent = "Password should contain at least one lowercase letter";
        UserPasswordError.style.color = 'red';
      } else if (!/[A-Z]/.test(userpassword)) {
        UserPasswordError.textContent = "Password should contain at least one uppercase letter";
        UserPasswordError.style.color = 'red';
      } else if (!/\d/.test(userpassword)) {
        UserPasswordError.textContent = "Password should contain at least one digit";
        UserPasswordError.style.color = 'red';
      } else {
        UserPasswordError.textContent = "Password is strong";
        UserPasswordError.style.color = 'green';
      }
    });

    actualForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user_name = UsernameInput.value.trim();
      const user_password = UserPasswordInput.value.trim();

      UsernameInput.value = '';
      UserPasswordInput.value = '';
      uinput.classList.add('hide');
      
      if (type === "signup") {
        const result = registerUser(user_name, user_password);
        alert(result.message);
        if (result.success && actualForm?.tagName === "FORM") {
          actualForm.reset();
          hideForm();
          uinput.classList.add('hide');
        }
      } else if (type === "login") {
        loginUser(user_name, user_password);
        window.location.href = '../../html/courses.html'
        uinput.classList.add('hide');
      }
    });
  };

  SignupBtn?.addEventListener("click", e => {
    uinput.classList.remove('hide');
    e.preventDefault();
    loadForm("signup");
  });

  LoginBtn?.addEventListener("click", e => {
    uinput.classList.remove('hide');
    e.preventDefault();
    loadForm("login");
  });
});


