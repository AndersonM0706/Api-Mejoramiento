import express from 'express';
import { showPlayerSelection, showPlayerSelectionId, addPlayerSelection, updatePlayerSelection, deletePlayerSelection } from '../controllers/playerSelectionController.js';

const router = express.Router();

// Ruta para mostrar todas las selecciones de guerreros
router.get('/', showPlayerSelection);

// Ruta para mostrar una selección de guerrero por ID
router.get('/:id', showPlayerSelectionId);

// Ruta para registrar una nueva selección de guerrero
router.post('/', addPlayerSelection);

// Ruta para actualizar una selección de guerrero existente
router.put('/:id', updatePlayerSelection);

// Ruta para eliminar una selección de guerrero por ID
router.delete('/:id', deletePlayerSelection);

export default router;