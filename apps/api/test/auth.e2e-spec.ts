import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
const cookieParser = require('cookie-parser');

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/auth/me (GET) - Unauthenticated', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401);
  });

  it('/api/v1/auth/github (GET) - Redirects to GitHub', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/github')
      .expect(302)
      .expect('Location', /github\.com\/login\/oauth\/authorize/);
  });

  it('/api/v1/auth/google (GET) - Redirects to Google', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/google')
      .expect(302)
      .expect('Location', /accounts\.google\.com\/o\/oauth2/);
  });
  
  it('/api/v1/auth/github/callback (GET) - Missing code/state', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/github/callback')
      .expect(401);
  });
});
