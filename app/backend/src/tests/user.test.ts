import * as sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import {
  messageFieldsUnfilled, 
  mockUserData, 
  messageInvalidFields,
  mockUserDataInvalid
} from './mocks/user.mock';
import User from '../database/models/User';
import { app } from '../app';
import JWT from '../utils/JWT';


chai.use(chaiHttp);

const expect = chai.expect;

describe('User', () => {
  let modelStub: sinon.SinonStub;

  afterEach(() => {
    sinon.restore();
  }
  );

  describe('POST /login', () => {
    it('should not login with empty fields', async () => {
      const res = await chai.request(app).post('/login').send({});

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.be.equal(messageFieldsUnfilled);
    });

    it('should not login without email', async () => {
      const res = await chai.request(app).post('/login')
        .send({ password: '123456'});

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.be.equal(messageFieldsUnfilled);
    });

    it('should not login without password', async () => {
      const res = await chai.request(app).post('/login')
        .send({ email: 'teste@teste.com'});

      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.be.equal(messageFieldsUnfilled);
    });

    it('should not login with invalid email', async () => {
      const res = await chai.request(app).post('/login')
      .send({email: 'test@teste.com', password: '123456'});

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal(messageInvalidFields);
    });

    it('should not login with invalid password', async () => {
      const res = await chai.request(app).post('/login')
      .send({email: 'teste@teste.com', password: '1234555'});

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal(messageInvalidFields);
    });

    it('should login with valid fields', async () => {
      modelStub = sinon.stub(User, 'findOne')
      .resolves(mockUserData as unknown as User);

      const res = await chai.request(app).post('/login')
        .send({
          email: 'teste@teste.com',
          password: 'secret_admin'
        });

      expect(res.status).to.be.equal(200);
      expect(res.body.token).not.to.be.empty;
    });

    it('should not login with internal error', async () => {
      modelStub = sinon.stub(User, 'findOne')
      .throws(new Error('Internal error'));

      const res = await chai.request(app).post('/login')
        .send({
          email: 'teste@teste.com',
          password: 'secret_admin',
        });

      expect(res.status).to.be.equal(500);
      expect(res.body.message).to.be.equal('Erro inesperado!');
    });
  });
  describe('GET /login/role', () => {
    it('should not get role without token', async () => {
      const res = await chai.request(app).get('/login/role');

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal('Token not found!');
    });

    it('should not get role with invalid token', async () => {
      const res = await chai.request(app).get('/login/role')
        .set('Authorization', 'invalid_token');

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal('Token must be a valid token!');
    });

    it('should get role with valid token', async () => {
      const token = new JWT().newToken({email: 'admin@admin.com', role: 'admin'});
      const res = await chai.request(app).get('/login/role')
        .set('Authorization', token);

      expect(res.status).to.be.equal(200);
      expect(res.body.role).to.be.deep.equal({'role': 'admin'});
    });
  });
});





