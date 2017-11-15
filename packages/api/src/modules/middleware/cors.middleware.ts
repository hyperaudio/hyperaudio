import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';

@Middleware()
export class CorsMiddleware implements NestMiddleware {
  resolve(): ExpressMiddleware {
    // return (req, res, next) => {
    //   res.header('Access-Control-Allow-Origin', '*');
    //   next();
    // };
    return (req, res, next) => {
      res.header('Access-Control-Allow-Credentials', 'true');
      let oneof = false;

      if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
      }

      if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
      }

      if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
      }

      if (oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
      }

      // intercept OPTIONS method
      if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    };
  }
}
