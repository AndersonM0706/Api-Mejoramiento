import express from 'express';
import { showPower, showPowerId, addPower, updatePower, deletePower } from '../controllers/powerController.js';

const router = express.Router();

// Ruta para mostrar todos los poderes de guerreros
router.get('/', showPower);

// Ruta para mostrar un poder de guerrero por ID
router.get('/:id', showPowerId);

// Ruta para registrar un nuevo poder de guerrero
router.post('/', addPower);

// Ruta para actualizar un poder de guerrero existente
router.put('/:id', updatePower);

// Ruta para eliminar un poder de guerrero por ID
router.delete('/:id', deletePower);

export default router;