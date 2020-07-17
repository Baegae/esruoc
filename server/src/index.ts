import 'module-alias/register';
import 'reflect-metadata';

import {createExpressServer} from 'routing-controllers';
import {connect as connectMongoDB} from '@database/Database';

const PORT = 8000;

const app = createExpressServer({
  controllers: []
});

connectMongoDB();

console.log(`[INFO] Server started on port=${PORT}`);
app.listen(8000);
