import 'reflect-metadata';

import {createExpressServer} from 'routing-controllers';
import swaggerUI from 'swagger-ui-express';
import {connect as connectMongoDB} from '@database/Database';
import {initFirebase} from '@database/Firebase';
import {UserController} from '@controller/UserController';

import swaggerConfig from '../swagger.config';

const PORT = 8000;

const swaggerSpec = swaggerConfig;
const app = createExpressServer({
  controllers: [UserController]
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

connectMongoDB();
initFirebase();

console.log(`[INFO] Server started on port=${PORT}`);
app.listen(8000);
