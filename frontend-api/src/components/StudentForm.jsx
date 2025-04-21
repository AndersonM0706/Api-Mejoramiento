import React, { useState, useEffect } from 'react';

const StudentForm = ({ onAdd, onUpdate, editingStudent }) => {
  const [document, setDocument] = useState(editingStudent?.document || '');
  const [name, setName] = useState(editingStudent?.name || '');
  const [age, setAge] = useState(editingStudent?.age || '');

  useEffect(() => {
    if (editingStudent) {
      setDocument(editingStudent.document);
      setName(editingStudent.name);
      setAge(editingStudent.age);
    } else {
      setDocument('');
      setName('');
      setAge('');
    }
  }, [editingStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = { document, name, age };
    if (editingStudent) {
      onUpdate({ ...editingStudent, ...newStudent });
    } else {
      onAdd(newStudent);
    }
    setDocument('');
    setName('');
    setAge('');
  };

  return (
    <div>
      <h2>{editingStudent ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Documento:</label>
          <input type="text" value={document} onChange={(e) => setDocument(e.target.value)} required />
        </div>
        <div>
          <label>Nombre:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Edad:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <button type="submit">{editingStudent ? 'Guardar Cambios' : 'Agregar Estudiante'}</button>
      </form>
    </div>
  );
};

export default StudentForm;