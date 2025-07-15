//this will help me display info about both student and teacher
export class Enrollment {
  constructor(matricule, courseCode, score = null) {
    this.matricule = matricule;       
    this.courseCode = courseCode;    
    this.score = score;               
  }
}

