import express from 'express';
import { showRaces, showRacesId, addRaces, updateRaces, deleteRaces } from '../controllers/racesController.js';

const router = express.Router();

// Ruta para mostrar todas las razas de guerreros
router.get('/', showRaces);

// Ruta para mostrar una raza de guerrero por ID
router.get('/:id', showRacesId);

// Ruta para registrar una nueva raza de guerrero
router.post('/', addRaces);

// Ruta para actualizar una raza de guerrero existente
router.put('/:id', updateRaces);

// Ruta para eliminar una raza de guerrero por ID
router.delete('/:id', deleteRaces);

export default router;