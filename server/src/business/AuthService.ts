import process from 'process';
import jwt from 'jsonwebtoken';
import User from '@shared/entity/User';

export function encodeJWT(user: User): string {
  const authKey = process.env.AUTH_KEY;
  return jwt.sign(
    {
      'uid': user.uid,
      'name': user.name,
      'email': user.email,
      'profileImageUrl': user.profileImageUrl
    },
    authKey!,
    {expiresIn: '7d'}
  );
}

export function verifyJWT(token: string): void {
  const authKey = process.env.AUTH_KEY;
  jwt.verify(token, authKey!);
}

export function decodeJWT(token: string): string {
  const decodedMap = jwt.decode(token) as { [key: string]: any };
  return decodedMap.uid;
}
