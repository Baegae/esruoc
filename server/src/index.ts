import 'reflect-metadata';

import {createExpressServer} from 'routing-controllers';
import {connect as connectMongoDB} from '@database/Database';
import {LectureController} from '@controller/LectureController';
import {initFirebase} from '@database/Firebase';

const PORT = 8000;

const app = createExpressServer({
  controllers: [LectureController],
});

connectMongoDB();
initFirebase();

console.log(`[INFO] Server started on port=${PORT}`);
app.listen(8000);
