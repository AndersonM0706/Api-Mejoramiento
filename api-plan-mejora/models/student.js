const Person = require('./person');

class Student extends Person {
    constructor(id, document, name, age, course = null) {
        super(id, document, name, age);
        this.course = course;
    }

    setCourse(course) {
        this.course = course;
    }

    getStudentInfo() {
        return {
            ...this.getBasicInfo(),
            course: this.course
        };
    }

    study() {
        return `${this.name} está estudiando.`;
    }
}

module.exports = Student;