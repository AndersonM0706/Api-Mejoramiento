import express from 'express';
import { showMatches, showMatchesId, addMatches, updateMatches, deleteMatches } from '../controllers/matchesController.js';

const router = express.Router();

// Ruta para mostrar todos los enfrentamientos de guerreros
router.get('/', showMatches);

// Ruta para mostrar un enfrentamiento de guerreros por ID
router.get('/:id', showMatchesId);

// Ruta para registrar un nuevo enfrentamiento de guerreros
router.post('/', addMatches);

// Ruta para actualizar un enfrentamiento de guerreros existente
router.put('/:id', updateMatches);

// Ruta para eliminar un enfrentamiento de guerreros por ID
router.delete('/:id', deleteMatches);

export default router;