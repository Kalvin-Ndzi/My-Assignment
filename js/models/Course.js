export class Course {
  constructor(courseName, code = null) {
    this.courseName = courseName;
    this.code = code || `CRS${Math.floor(Math.random() * 1000)}`;
  }
}
