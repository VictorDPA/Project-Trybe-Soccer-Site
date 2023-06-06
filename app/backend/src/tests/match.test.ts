import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import Match from '../database/models/Match';

import { app } from '../app';
import { mockAllMatches, mockOneMatch } from './mocks/match.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('/matches endpoint', () => {
  let modelStub: sinon.SinonStub;

  afterEach(() => {
    sinon.restore();
  });
  
  describe('GET /match', () => {
    it('should return all matches', async () => {
      modelStub = sinon.stub(Match, 'findAll')
        .resolves(mockAllMatches as unknown as Match[]);
  
      const res = await chai.request(app).get('/matches');
  
      expect(res.status).to.equal(200);
      expect(res.body).to.be.deep.equal(mockAllMatches);
    });
  });
});