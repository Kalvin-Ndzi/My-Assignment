class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }

    createAccount() {
        // Logic to store user in local storage

    }

    loginUser(passwordAttempt) {
        //logic to login a user

        return this.password === passwordAttempt;
    }

    logoutUser() {
        // Redirect user to login screen and clear the session

    }
}

//i am considering the case where a student is able to use the system even though this is not implemented
class Student extends User {
    constructor(name, password, matricule = null) {
        super(name, password);
        this.matricule = matricule;
    }

    createStudent() {
        // Store student data to local storage
    }

    generateStudentMatricule() {

        this.matricule = `STU${Math.floor(Math.random() * 10000)}`;
    }
}

class Course {
    constructor(courseName, code = null) {
        this.courseName = courseName;
        this.code = code || `CRS${Math.floor(Math.random() * 1000)}`;
    }
}

class SchoolSystem {
    constructor() {
        //the courses and students are arrays which is initially empty
        this.students = [];
        this.courses = [];
    }

    addStudent(student) {
        //check if student is a valid student object and add it to the students list
        if (student instanceof Student) {
            this.students.push(student);
        }
    }

    addCourse(course) {
        //check if course is a valid course object and then add's it to the list 
        if (course instanceof Course) {
            this.courses.push(course);
        }
    }

    deleteCourse(courseCode) {
        //remove the course having 'courseCode' as it's code 
        this.courses = this.courses.filter(c => c.code !== courseCode);
    }

    deleteStudent(matricule) {
        //remove the student with the matricule 'matricule
        this.students = this.students.filter(s => s.matricule !== matricule);
    }
}

