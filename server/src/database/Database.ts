import mongoose from 'mongoose';

let database: mongoose.Connection;

export const connect = () => {
  const uri = 'mongodb://localhost/esruoc?retryWrites=true&w=majority';

  if (database) {
    return;
  }

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = mongoose.connection;
  database.once('open', async () => {
    console.log('[INFO] Connected to Esruoc database!');
  });
  database.on('error', () => {
    console.log('[ERROR] Connecting to database error.');
  });
};
