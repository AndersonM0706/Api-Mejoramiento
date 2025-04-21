import express from 'express';
import { showGame, showGameId, addGame, updateGame, deleteGame } from '../controllers/gameController.js';

const router = express.Router();

// Ruta para mostrar todos los juegos de guerreros
router.get('/', showGame);

// Ruta para mostrar un juego de guerreros por ID
router.get('/:id', showGameId);

// Ruta para registrar un nuevo juego de guerreros
router.post('/', addGame);

// Ruta para actualizar un juego de guerreros existente
router.put('/:id', updateGame);

// Ruta para eliminar un juego de guerreros por ID
router.delete('/:id', deleteGame);

export default router;