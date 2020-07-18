import process from 'process';
import jwt from 'jsonwebtoken';
import User from '@shared/entity/User';
import {UnauthorizedError} from 'routing-controllers';

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

export function verifyJWT(token: string): string {
  const authKey = process.env.AUTH_KEY;
  try {
    const decodedToken = jwt.verify(token, authKey!) as { [key: string]: any };
    return decodedToken.uid;
  } catch (e) {
    throw new UnauthorizedError('Unauthorized');
  }
}
