import { SchoolSystem } from "./usermanager.js";

export class Student {
  static count = parseInt(localStorage.getItem("student-count")) || 1;

  constructor(name, matricule = null) {
    this.name = name;
    this.matricule = matricule || Student.generateMatricule();
  }

  static generateMatricule() {
    const padded = String(Student.count).padStart(3, '0'); // STU001 format
    const matricule = `STU${padded}`;
    Student.count++;
    localStorage.setItem("student-count", Student.count); // persist count
    return matricule;
  }
}


