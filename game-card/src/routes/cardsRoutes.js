import express from 'express';
import { showCards, showCardId, addCard, updateCard, deleteCard } from '../controllers/cardsController.js';

const router = express.Router();

// Ruta para mostrar todas las cartas de guerreros
router.get('/', showCards);

// Ruta para mostrar una carta de guerrero// Ruta para mostrar una carta de guerrero por ID
router.get('/:id', showCardId);

// Ruta para registrar una nueva carta de guerrero
router.post('/', addCard);

// Ruta para actualizar una carta de guerrero existente
router.put('/:id', updateCard);

// Ruta para eliminar una carta de guerrero por ID
router.delete('/:id', deleteCard);

export default router;