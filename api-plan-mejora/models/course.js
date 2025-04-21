class Course {
    constructor(id, name, teacher = null) {
        this.id = id;
        this.name = name;
        this.teacher = teacher;
        this.students = [];
    }

    addStudent(student) {
        this.students.push(student);
    }

    getCourseInfo() {
        return {
            id: this.id,
            name: this.name,
            teacher: this.teacher ? this.teacher.getBasicInfo() : null,
            students: this.students.map(student => student.getBasicInfo())
        };
    }
}

module.exports = Course;