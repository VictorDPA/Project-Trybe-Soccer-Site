import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { mockTeams } from './mocks/team.mock';
import { mockAllMatchesNotInProgress } from './mocks/match.mock';
import {
  mockAllHomeTeamsPerformance,
  mockAllAwayTeamsPerformance,
  mockAllTeamsPerformanceOverrall,
} from './mocks/leaderboard.mock';
import Match from '../database/models/Match';
import Team from '../database/models/Team';

import { app } from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('/leaderboard endpoint', () => {
  let modelStub: sinon.SinonStub;

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /leaderboard/home', () => {
    it('should return all home teams performance', async () => {
      modelStub = sinon.stub(Match, 'findAll')
        .resolves(mockAllMatchesNotInProgress as unknown as Match[]);

      modelStub = sinon.stub(Team, 'findAll')
        .resolves(mockTeams as unknown as Team[]);

      const res = await chai.request(app).get('/leaderboard/home');

      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal(mockAllHomeTeamsPerformance);
    });

    it('should return all away teams performance', async () => {
      modelStub = sinon.stub(Match, 'findAll')
        .resolves(mockAllMatchesNotInProgress as unknown as Match[]);

      modelStub = sinon.stub(Team, 'findAll')
        .resolves(mockTeams as unknown as Team[]);

      const res = await chai.request(app).get('/leaderboard/away');

      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal(mockAllAwayTeamsPerformance);
    });

    it('should return all information about teams performance', async () => {
      modelStub = sinon.stub(Match, 'findAll')
        .resolves(mockAllMatchesNotInProgress as unknown as Match[]);

      modelStub = sinon.stub(Team, 'findAll')
        .resolves(mockTeams as unknown as Team[]);

      const res = await chai.request(app).get('/leaderboard/overall');

      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal(mockAllTeamsPerformanceOverrall);
    });
  });
});