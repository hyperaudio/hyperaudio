import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Middleware()
export class AuthMiddleware implements NestMiddleware {
  resolve(): ExpressMiddleware {
    return (req, res, next) => {
      if (req.get('Authorization')) {
        try {
          const decoded = jwt.verify(req.get('Authorization').split(' ').pop(), process.env.JWT_SECRET);
          res.set('X-User', decoded.user);
        } catch (ignored) {}
      }

      next();
    };
  }
}
