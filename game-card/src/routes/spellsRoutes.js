import express from 'express';
import { showSpells, showSpellsId, addSpells, updateSpells, deleteSpells } from '../controllers/spellsController.js';

const router = express.Router();

// Ruta para mostrar todos los hechizos de guerreros
router.get('/', showSpells);

// Ruta para mostrar un hechizo de guerrero por ID
router.get('/:id', showSpellsId);

// Ruta para registrar un nuevo hechizo de guerrero
router.post('/', addSpells);

// Ruta para actualizar un hechizo de guerrero existente
router.put('/:id', updateSpells);

// Ruta para eliminar un hechizo de guerrero por ID
router.delete('/:id', deleteSpells);

export default router;