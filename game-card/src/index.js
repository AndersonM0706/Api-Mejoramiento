import app from './app/app.js';
import dotenv from 'dotenv';

dotenv.config(); // Cambiado para buscar el archivo .env en la raíz
const PORT = process.env.SERVER_PORT || 3000; // Cambiado a SERVER_PORT para coincidir con .env

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});