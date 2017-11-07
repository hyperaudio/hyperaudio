import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

@Middleware()
export class OrgsMiddleware implements NestMiddleware {
  resolve(): ExpressMiddleware {
    return (req, res, next) => {
      let organisation = null;
      if (req.headers.host.indexOf('api') > 0) {
        organisation = req.headers.host.substring(0, req.headers.host.indexOf('api') - 1);
        res.set('X-Organisation', organisation);
      }

      next();
    };
  }
}
