import * as jwt from 'jsonwebtoken';
import { Component, Inject } from '@nestjs/common';

@Component()
export class AuthService {
  async createToken(username, password) {
    const expiresIn = 60 * 60, secretOrKey = process.env.JWT_SECRET;
    const payload = {
      user: 'gridinoc'
    };

    const token = jwt.sign(payload, secretOrKey, { expiresIn });
    return { expiresIn, token, user: 'gridinoc' };
  }

  async validateUser(signedUser): Promise<boolean> {
    // put some validation logic here
    // for example query user by id / email / username
    return true;
  }

  async whoami(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { user: decoded.user };
    } catch (err) {
      return { user: null };
    }
  }
}
