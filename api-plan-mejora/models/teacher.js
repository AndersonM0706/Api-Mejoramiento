const Person = require('./person');

class Teacher extends Person {
    constructor(id, document, name, age, specialty) {
        super(id, document, name, age);
        this.specialty = specialty;
    }

    getTeacherInfo() {
        return {
            ...this.getBasicInfo(),
            specialty: this.specialty
        };
    }

    teach() {
        return `${this.name} está enseñando ${this.specialty}.`;
    }
}

module.exports = Teacher;