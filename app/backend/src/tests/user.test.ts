import * as sinon from 'sinon';
import { expect } from 'chai';
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


chai.use(chaiHttp);

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

    it('should not login with invalid fields', async () => {
      const res = await chai.request(app).post('/login')
      .send({email: 'test.test', password: '1234555'});

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal(messageInvalidFields);
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
});





