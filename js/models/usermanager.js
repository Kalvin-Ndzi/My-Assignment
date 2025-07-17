import { User } from "./user.js";
import { Course } from "./Course.js";
import { Student } from "./student.js";
import { Enrollment } from "../models/enrolment.js";

export class SchoolSystem {
  constructor() {
    this.users = [];
    this.students = [];
    this.courses = [];
    this.enrollments = [];
  }


  addUser(user) {
      this.users.push(user);
  }

  findUser(name, password) {
    return this.users.find(user => user.name === name && user.password === password);
  }


  addStudent(student) {
    if (student instanceof Student) {
      this.students.push(student);
    }
  }

  deleteStudent(matricule) {
    this.students = this.students.filter(s => s.matricule !== matricule);
    this.enrollments = this.enrollments.filter(e => e.matricule !== matricule); // clean up enrollments too
  }

  addCourse(course) {
    if (course instanceof Course) {
      this.courses.push(course);
    }
  }

  deleteCourse(courseCode) {
    this.courses = this.courses.filter(c => c.code !== courseCode);
    this.enrollments = this.enrollments.filter(e => e.courseCode !== courseCode); // clean up enrollments too
  }


  enrollAllStudents() {
    this.enrollments = [];
    this.students.forEach(student => {
      this.courses.forEach(course => {
        this.enrollments.push(new Enrollment(student.matricule, course.code));
      });
    });
  }

  getStudentEnrollments(matricule) {
    return this.enrollments.filter(e => e.matricule === matricule);
  }

  updateScore(matricule, courseCode, score) {
    const enrollment = this.enrollments.find(e =>
      e.matricule === matricule && e.courseCode === courseCode
    );
    if (enrollment) {
      enrollment.score = score;
    }
  }


  saveToStorage() {
    localStorage.setItem("users", JSON.stringify(this.users));
    localStorage.setItem("students", JSON.stringify(this.students));
    localStorage.setItem("courses", JSON.stringify(this.courses));
    localStorage.setItem("enrollments", JSON.stringify(this.enrollments));
  }

  loadFromStorage() {
    const rawUsers = JSON.parse(localStorage.getItem("users")) || [];
    const rawStudents = JSON.parse(localStorage.getItem("students")) || [];
    const rawCourses = JSON.parse(localStorage.getItem("courses")) || [];
    const rawEnrollments = JSON.parse(localStorage.getItem("enrollments")) || [];

    this.users = rawUsers.map(u => new User(u.name, u.password)); // adjust based on User constructor
    this.students = rawStudents.map(s => new Student(s.name, s.matricule));
    this.courses = rawCourses.map(c => new Course(c.code, c.title));
    this.enrollments = rawEnrollments.map(e => new Enrollment(e.matricule, e.courseCode, e.score));
  }
}
