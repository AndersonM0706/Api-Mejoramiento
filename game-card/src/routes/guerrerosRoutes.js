import express from 'express';
import { showGuerreros, showGuerreroId, addGuerrero, updateGuerrero, deleteGuerrero } from '../controllers/guerrerosController.js';

const router = express.Router();

// Ruta para mostrar todos los guerreros
router.get('/', showGuerreros);

// Ruta para mostrar un guerrero por ID
router.get('/:id', showGuerreroId);

// Ruta para agregar un nuevo guerrero
router.post('/', addGuerrero);

// Ruta para actualizar un guerrero
router.put('/:id', updateGuerrero);

// Ruta para eliminar un guerrero
router.delete('/:id', deleteGuerrero);

export default router;