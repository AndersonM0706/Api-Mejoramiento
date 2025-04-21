import React from 'react';

const StudentList = ({ students, onDelete, onEdit }) => {
  return (
    <div>
      <h2>Lista de Estudiantes</h2>
      {students.length === 0 ? (
        <p>No hay estudiantes registrados.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.name} (Documento: {student.document}, Edad: {student.age})
              <button onClick={() => onEdit(student.id)}>Editar</button>
              <button onClick={() => onDelete(student.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentList;