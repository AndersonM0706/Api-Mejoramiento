// config/swaggerOptions.js
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Plan Mejora', // Puedes ajustar el título
    version: '1.0.0',
    description: 'Documentación de la API del Plan de Mejora', // Ajusta la descripción
  },
  servers: [
    {
      url: 'http://localhost:3000', // Asegúrate de usar la URL base correcta de tu API
      description: 'Servidor de desarrollo',
    },
  ],
};

const options = { // ¡CORRECCIÓN IMPORTANTE: Definimos 'options' aquí!
  swaggerDefinition,
  apis: ['./controllers/*.js'], // Apunta a tu archivo de controlador (ajusta la ruta si es necesario)
};

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;