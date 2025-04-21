import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Configuración de dotenv
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Importación de rutas utilizando ES6
import authRoutes from '../routes/authRoutes.js';
import cardsRoutes from '../routes/cardsRoutes.js';
import fightRoutes from '../routes/fightRoutes.js';
import gameRoutes from '../routes/gameRoutes.js';
import matchesRoutes from '../routes/matchesRoutes.js';
import playerSelectionRoutes from '../routes/playerSelectionRoutes.js';
import racesRoutes from '../routes/racesRoutes.js';
import rankingRoutes from '../routes/rankingRoutes.js';
import spellsRoutes from '../routes/spellsRoutes.js';
import usersRoutes from '../routes/usersRoutes.js';
import guerrerosRoutes from '../routes/guerrerosRoutes.js';

// Nota: corregí el nombre del archivo y ruta

// Declaración de rutas
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/fight', fightRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/playerselection', playerSelectionRoutes);
app.use('/api/races', racesRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/spells', spellsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/guerreros', guerrerosRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.send('Bienvenido al juego de cartas Guerreros');
});

export default app;