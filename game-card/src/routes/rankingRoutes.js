import express from 'express';
import { showRanking, showRankingId, addRanking, updateRanking, deleteRanking } from '../controllers/rankingController.js';

const router = express.Router();

// Ruta para mostrar el ranking completo de guerreros
router.get('/', showRanking);

// Ruta para mostrar el ranking de un guerrero por ID
router.get('/:id', showRankingId);

// Ruta para registrar un nuevo guerrero en el ranking
router.post('/', addRanking);

// Ruta para actualizar un registro del ranking de guerreros existente
router.put('/:id', updateRanking);

// Ruta para eliminar un registro del ranking de guerreros por ID
router.delete('/:id', deleteRanking);

export default router;