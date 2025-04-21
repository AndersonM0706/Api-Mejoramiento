const pool = require('../config/database');

/**
 * @route POST /persons
 * @group Persons - Operaciones relacionadas con las personas
 * @param {Person.model} person.body.required - Datos para crear una nueva persona
 * @returns {Person} 201 - La persona recién creada
 * @returns {Error} 400 - Todos los campos (documento, nombre, edad) son requeridos
 * @returns {Error} 500 - Error al crear la persona en la base de datos
 */
exports.createPerson = async (req, res) => {
    const { document, name, age } = req.body;
    if (!document || !name || !age) {
        return res.status(400).json({ message: 'Todos los campos (documento, nombre, edad) son requeridos.' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO person (document, name, age) VALUES (?, ?, ?)',
            [document, name, age]
        );

        const personId = result.insertId;
        const [newPerson] = await pool.execute(
            'SELECT * FROM person WHERE id = ?',
            [personId]
        );

        res.status(201).json(newPerson[0]);

    } catch (error) {
        console.error('Error al crear persona:', error);
        res.status(500).json({ message: 'Error al crear la persona en la base de datos.' });
    }
};

/**
 * @route GET /persons
 * @group Persons - Operaciones relacionadas con las personas
 * @returns {Array<Person>} 200 - Un array de todas las personas
 * @returns {Error} 500 - Error al obtener las personas de la base de datos
 */
exports.getAllPersons = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM person');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener personas:', error);
        res.status(500).json({ message: 'Error al obtener las personas de la base de datos.' });
    }
};

/**
 * @route GET /persons/{id}
 * @group Persons - Operaciones relacionadas con las personas
 * @param {number} id.path.required - ID de la persona a obtener
 * @returns {Person} 200 - La persona encontrada
 * @returns {Error} 404 - Persona no encontrada
 * @returns {Error} 500 - Error al obtener la persona de la base de datos
 */
exports.getPersonById = async (req, res) => {
    const personId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute('SELECT * FROM person WHERE id = ?', [personId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Persona no encontrada.' });
        }
    } catch (error) {
        console.error('Error al obtener persona por ID:', error);
        res.status(500).json({ message: 'Error al obtener la persona de la base de datos.' });
    }
};

/**
 * @route PUT /persons/{id}
 * @group Persons - Operaciones relacionadas con las personas
 * @param {number} id.path.required - ID de la persona a actualizar
 * @param {Person.model} person.body.required - Datos para actualizar la persona
 * @returns {Person} 200 - La persona actualizada
 * @returns {Error} 400 - Todos los campos (documento, nombre, edad) son requeridos para la actualización
 * @returns {Error} 404 - Persona no encontrada
 * @returns {Error} 500 - Error al actualizar la persona en la base de datos
 */
exports.updatePerson = async (req, res) => {
    const personId = parseInt(req.params.id);
    const { document, name, age } = req.body;
    if (!document || !name || !age) {
        return res.status(400).json({ message: 'Todos los campos (documento, nombre, edad) son requeridos para la actualización.' });
    }
    try {
        const [result] = await pool.execute(
            'UPDATE person SET document = ?, name = ?, age = ? WHERE id = ?',
            [document, name, age, personId]
        );
        if (result.affectedRows > 0) {
            const [updatedPerson] = await pool.execute(
                'SELECT * FROM person WHERE id = ?',
                [personId]
            );
            res.status(200).json(updatedPerson[0]);
        } else {
            res.status(404).json({ message: 'Persona no encontrada.' });
        }
    } catch (error) {
        console.error('Error al actualizar persona:', error);
        res.status(500).json({ message: 'Error al actualizar la persona en la base de datos.' });
    }
};

/**
 * @route DELETE /persons/{id}
 * @group Persons - Operaciones relacionadas con las personas
 * @param {number} id.path.required - ID de la persona a eliminar
 * @returns {null} 204 - Persona eliminada exitosamente
 * @returns {Error} 404 - Persona no encontrada
 * @returns {Error} 500 - Error al eliminar la persona de la base de datos
 */
exports.deletePerson = async (req, res) => {
    const personId = parseInt(req.params.id);
    try {
        const [result] = await pool.execute('DELETE FROM person WHERE id = ?', [personId]);
        if (result.affectedRows > 0) {
            res.status(204).send(); // No Content - La eliminación fue exitosa
        } else {
            res.status(404).json({ message: 'Persona no encontrada.' });
        }
    } catch (error) {
        console.error('Error al eliminar persona:', error);
        res.status(500).json({ message: 'Error al eliminar la persona de la base de datos.' });
    }
};

/**
 * @typedef Person
 * @property {number} id
 * @property {string} document.required
 * @property {string} name.required
 * @property {integer} age.required
 */