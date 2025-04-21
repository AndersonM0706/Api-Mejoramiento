class Person {
    constructor(id, document, name, age) {
        this.id = id;
        this.document = document;
        this.name = name;
        this.age = age;
    }

    getBasicInfo() {
        return {
            id: this.id,
            name: this.name,
            age: this.age
        };
    }

    greet() {
        return `Hola, mi nombre es ${this.name}.`;
    }
}

module.exports = Person;