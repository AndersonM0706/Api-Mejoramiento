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
  
  const options = {
    swaggerDefinition,
    apis: ['./controllers/*.js', './api-plan-mejora.js'], // Apuntamos a los archivos de controladores y al archivo principal
  };
  
  const swaggerJSDoc = require('swagger-jsdoc');
  const swaggerSpec = swaggerJSDoc(options);
  
  module.exports = swaggerSpec;