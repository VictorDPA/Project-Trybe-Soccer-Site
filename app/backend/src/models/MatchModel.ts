import MatchInterface from '../interfaces/MatchInterfaces';
import Match from '../database/models/Match';

export default class MatchModel {
  constructor(private match = Match) {}

  async getAllMatches() {
    const matches = await this.match.scope('withTeams').findAll();
    return matches;
  }

  async getAllMatchesInProgressNoScope(inProgress: boolean) {
    const matches = await this.match.findAll({
      where: { inProgress },
    });
    return matches;
  }

  async getMatchesInProgress(inProgress: boolean) {
    const matches = await this.match.scope('withTeams').findAll({
      where: { inProgress },
    });
    return matches;
  }

  async createMatch(match: MatchInterface) {
    const create = await this.match.create({
      ...match,
      inProgress: true,
    });
    return create;
  }

  async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    await this.match.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );

    const updatedMatch = await this.match.scope('withTeams').findByPk(id);
    return updatedMatch;
  }

  async endMatch(id: number) {
    await this.match.update({ inProgress: false }, { where: { id } });
  }
}
