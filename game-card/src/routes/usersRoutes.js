import express from 'express';
import { showUsers, showUserId, addUsers, updateUsers, deleteUsers } from '../controllers/usersController.js';

const router = express.Router();

// Ruta para mostrar todos los usuarios de guerreros
router.get('/', showUsers);

// Ruta para mostrar un usuario de guerrero por ID
router.get('/:id', showUserId);

// Ruta para registrar un nuevo usuario guerrero
router.post('/', addUsers);

// Ruta para actualizar un usuario guerrero existente
router.put('/:id', updateUsers);

// Ruta para eliminar un usuario guerrero por ID
router.delete('/:id', deleteUsers);

export default router;