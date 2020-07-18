import process from 'process';
import jwt from 'jsonwebtoken';

export function encodeJWT(userId: string): string {
  const authKey = process.env.AUTH_KEY;
  return jwt.sign(
    {'userId': userId},
    authKey
  );
}
