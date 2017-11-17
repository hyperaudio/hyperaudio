import * as jwt from 'jsonwebtoken';
import { Component, Inject } from '@nestjs/common';

@Component()
export class AuthService {
  async validateUser(signedUser): Promise<boolean> {
    // put some validation logic here
    // for example query user by id / email / username
    return true;
  }

  async whoami(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const expiresIn = 3600 * 24 * 30;
      const secretOrKey = process.env.JWT_SECRET;
      const payload = { user: decoded.user, id: decoded.id };
      const refreshedToken = jwt.sign(payload, secretOrKey, { expiresIn });
      return { exp: expiresIn, token: refreshedToken, user: decoded.user, id: decoded.id };
    } catch (err) {
      return { user: null };
    }
  }
}
