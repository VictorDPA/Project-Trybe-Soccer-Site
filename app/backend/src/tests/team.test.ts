import * as sinon from 'sinon';
import * as chai from 'chai';
//@ts-ignore
import chaiHttp = require('chai-http');
import { mockTeams, mockOneTeam } from './mocks/team.mock';
import Team from '../database/models/Team';
import { app } from '../app';

chai.use(chaiHttp);

const expect = chai.expect;

describe('Team', () => {
  let modelStub: sinon.SinonStub;

  afterEach(() => {
    modelStub.restore();
  });

  describe('GET /teams', () => {
    beforeEach(() => {
      modelStub = sinon.stub(Team, 'findAll')
        .resolves(mockTeams as unknown as Team[]);
    });

    it('should return all teams', async () => {
      const res = await chai.request(app).get('/teams');

      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal(mockTeams);
    });
  });

  describe('GET /teams/:id', () => {
    beforeEach(() => {
      modelStub = sinon.stub(Team, 'findByPk')
        .resolves(mockOneTeam as unknown as Team);
    });

    it('should return one team', async () => {
      const res = await chai.request(app).get('/teams/10');

      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.deep.equal(mockOneTeam);
    });
  });
});
