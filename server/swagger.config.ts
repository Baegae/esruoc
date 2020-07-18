import swaggerDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  info: {
    title: 'Esruoc API',
    version: '1.0.0',
    description: '새로운 온라인 강의 플랫폼, Esruoc 의 API 문서에요!',
  }
};

const options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./src/*/**.ts'],
};

const swaggerSpec = swaggerDoc(options);

export default swaggerSpec;
