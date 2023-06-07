import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import Match from '../database/models/Match';

import { app } from '../app';
import {
  mockAllMatches,
  mockMatchCreated,
  dataMatchToCreate,
  invalidDataMatchToCreate,
  mockAllMatchesInProgress,
  mockAllMatchesNotInProgress,
  invalidTeamMatchToCreate,
} from './mocks/match.mock';
import JWT from '../utils/JWT';

chai.use(chaiHttp);

const { expect } = chai;

describe('/matches endpoint', () => {
  let modelStub: sinon.SinonStub;

  afterEach(() => {
    sinon.restore();
  });
  
  describe('GET /matches', () => {
    it('should return all matches', async () => {
      modelStub = sinon.stub(Match, 'findAll')
        .resolves(mockAllMatches as unknown as Match[]);
  
      const res = await chai.request(app).get('/matches');
  
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal(mockAllMatches);
    });
  });

  describe('GET with query /matches', () => {
    it('should return all matches in progress', async () => {
      modelStub = sinon.stub(Match, 'findAll')
        .resolves(mockAllMatchesInProgress as unknown as Match[]);
  
      const res = await chai.request(app).get('/matches?inProgress=true');
  
      expect(res.status).to.equal(200);
      expect(res.body).to.be.deep.equal(mockAllMatchesInProgress);
    });

    it('should return all matches not in progress', async () => {
      modelStub = sinon.stub(Match, 'findAll')
        .resolves(mockAllMatchesNotInProgress as unknown as Match[]);
  
      const res = await chai.request(app).get('/matches?inProgress=false');
  
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal(mockAllMatchesNotInProgress);
    });
  });

  describe('PATCH /matches/:id/finish', () => {
    it('should return 401 if token is not provided', async () => {
      const res = await chai.request(app).patch('/matches/1/finish');

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal('Token not found');
    });

    it('should return 401 if token is invalid', async () => {
      const res = await chai.request(app).patch('/matches/1/finish')
        .set('Authorization', 'invalid_token');

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal('Token must be a valid token');
    });

    it('should return the match if it is a valid token', async () => {
      modelStub = sinon.stub(Match, 'update').resolves([1]);

      const token = new JWT().newToken({ email: 'admin@admin.com', role: 'admin' });
      const res = await chai.request(app).patch('/matches/1/finish')
        .set('Authorization', token);

      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal({ message: 'Finished' });
    });
  });

  describe('PATCH /matches/:id', () => {
    it('should return 401 if token is not provided', async () => {
      const res = await chai.request(app).patch('/matches/1');

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal('Token not found');
    });

    it('should return 401 if token is invalid', async () => {
      const res = await chai.request(app).patch('/matches/1')
        .set('Authorization', 'invalid_token');

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal('Token must be a valid token');
    });

    it('should return partial match if it is a valid token', async () => {
      modelStub = sinon.stub(Match, 'update').resolves([1]);
      
      const token = new JWT().newToken({ email: 'admin@admin.com', role: 'admin' });
      const res = await chai.request(app).patch('/matches/1/finish')
        .set('Authorization', token);

      expect(res.status).to.be.equal(200);
      expect(res.body).to.not.be.empty;
    });
  });

  describe('POST /matches', () => {
    it('should return 401 if token is not provided', async () => {
      const res = await chai.request(app).post('/matches');

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal('Token not found');
    });

    it('should return 401 if token is invalid', async () => {
      const res = await chai.request(app).post('/matches')
        .set('Authorization', 'invalid_token');

      expect(res.status).to.be.equal(401);
      expect(res.body.message).to.be.equal('Token must be a valid token');
    });

    it('should return the data of the created match if it is a valid token', async () => {
      modelStub = sinon.stub(Match, 'create').resolves(mockMatchCreated as unknown as Match);
      
      const token = new JWT().newToken({ email: 'admin@admin.com', role: 'admin' });
      const res = await chai.request(app).post('/matches')
        .set('Authorization', token)
        .send(dataMatchToCreate);

      expect(res.status).to.be.equal(201);
      expect(res.body).to.be.deep.equal(mockMatchCreated);
    });

    it('should return 422 if the data teams are equals', async () => {
      modelStub = sinon.stub(Match, 'create').resolves(undefined);
      
      const token = new JWT().newToken({ email: 'admin@admin.com', role: 'admin' });
      const res = await chai.request(app).post('/matches')
        .set('Authorization', token)
        .send(invalidDataMatchToCreate);

      expect(res.status).to.be.equal(422);
      expect(res.body.message).to.be.equal('It is not possible to create a match with two equal teams');
    });

    it('should return 404 if the team does not exist', async () => {
      modelStub = sinon.stub(Match, 'findByPk').resolves(undefined);

      const token = new JWT().newToken({ email: 'admin@admin.com', role: 'admin' });
      const res = await chai.request(app).post('/matches')
        .set('Authorization', token)
        .send(invalidTeamMatchToCreate);

      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal('There is no team with such id!');
    });
  });
});