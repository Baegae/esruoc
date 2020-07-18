import 'reflect-metadata';

import {Action, createExpressServer} from 'routing-controllers';
import swaggerUI from 'swagger-ui-express';
import {connect as connectMongoDB} from '@database/Database';
import {initFirebase} from '@database/Firebase';
import {LectureController} from '@controller/LectureController';
import {UserController} from '@controller/UserController';
import {verifyJWT} from '@business/AuthService';
import UserRepository from '@repository/UserRepository';

import swaggerConfig from '../swagger.config';

const PORT = 8000;

const swaggerSpec = swaggerConfig;
const userRepository = new UserRepository();
const app = createExpressServer({
  controllers: [LectureController, UserController],
  currentUserChecker: async (action: Action, value?: any) => {
    const token = action.request.headers['authorization'];
    const uid = verifyJWT(token);
    return userRepository.findUserByUid(uid);
  }
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

connectMongoDB();
initFirebase();

console.log(`[INFO] Server started on port=${PORT}`);
app.listen(8000);
