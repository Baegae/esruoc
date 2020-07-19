import process from 'process';
import stream from 'stream';
import * as admin from 'firebase-admin';

export function initFirebase() {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.GOOGLE_FIREBASE_STORAGE_BUCKET
  });
}

export async function uploadFileToStorage(path: string, fileName: string, file: any): Promise<string> {
  const storage = admin.storage().bucket();

  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(file.buffer, 'ascii'));

  const storageFile = storage.file(`${path}/${fileName}`);
  bufferStream.pipe(
    storageFile.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    })
  );

  return new Promise<string>((resolve, reject) => {
    bufferStream.on('error', reject);
    bufferStream.on('finish', () => {
      resolve(`https://storage.googleapis.com/${storage.name}/${path}/${fileName}`);
      bufferStream.end(file.buffer);
    });
  });
}

export function getSignedUrl(filePath: string): Promise<string> {
  const storage = admin.storage().bucket();

  const currentTime = new Date();

  const storageFile = storage.file(filePath);

  return new Promise<string>((resolve, reject) => {
    storageFile.getSignedUrl({
      action: 'read',
      expires: currentTime.setHours(currentTime.getHours() + 2)
    }, (err, url) => {
      if (err != null) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

export function getPublicUrl(filePath: string): string {
  const storage = admin.storage().bucket();
  return `https://storage.googleapis.com/${storage.name}/${filePath}`;
}
