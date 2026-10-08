import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  // Client IP resolution for rate limiting. The API is reached through the web
  // service's reverse proxy (Next.js rewrite), so `trust proxy` must reflect the
  // number of trusted proxy hops for `req.ip` to reflect the true client address.
  // Defaults to 0 (no trust = safe: never honor client-supplied forwarding
  // headers); set TRUST_PROXY to the hop count when deployed behind a known
  // reverse proxy that sets X-Forwarded-For.
  app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 0));

  // Baseline security headers for API responses. The API serves JSON, not
  // HTML, so no CSP is emitted here (the frontend owns the CSP). HSTS is only
  // emitted in production where the deployment is HTTPS-only.
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    }
    next();
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
