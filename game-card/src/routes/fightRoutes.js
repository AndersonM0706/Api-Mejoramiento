import express from 'express';
import { showFight, showFightId, addFight, updateFight, deleteFight } from '../controllers/fightController.js';

const router = express.Router();

// Ruta para mostrar todos los combates de guerreros
router.get('/', showFight);

// Ruta para mostrar un combate de guerreros por ID
router.get('/:id', showFightId);

// Ruta para registrar un nuevo combate de guerreros
router.post('/', addFight);

// Ruta para actualizar un combate de guerreros existente
router.put('/:id', updateFight);

// Ruta para eliminar un combate de guerreros por ID
router.delete('/:id', deleteFight);

export default router;