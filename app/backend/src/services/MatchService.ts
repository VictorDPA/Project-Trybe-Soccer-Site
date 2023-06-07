import { StatusCodes } from 'http-status-codes';
import ErrorLaunch from '../utils/ErrorLaunch';
import TeamModel from '../models/TeamModel';
import MatchModel from '../models/MatchModel';
import { MatchProgressInterface as IMatch } from '../interfaces/LeaderboardInterfaces';

export default class MatchService {
  constructor(
    private matchModel = new MatchModel(),
    private teamModel = new TeamModel(),
  ) {}

  async getAllMatches(inProgress?: string) {
    if (inProgress === 'true') {
      const matches = await this.matchModel.getMatchesInProgress(true);
      return matches;
    }
    const matches = await this.matchModel.getAllMatches();
    return matches;
  }

  async createMatch(match: IMatch) {
    const { homeTeamId, awayTeamId } = match;
    const homeTeam = await this.teamModel.getOneTeam(homeTeamId);
    const awayTeam = await this.teamModel.getOneTeam(awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new ErrorLaunch(StatusCodes.NOT_FOUND, 'There is no team with sich id!');
    }
    const create = await this.matchModel.createMatch(match);
    return create;
  }

  async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    const updatedMatch = await this.matchModel.updateMatch(id, homeTeamGoals, awayTeamGoals);
    return updatedMatch;
  }

  async endMatch(id: number) {
    await this.matchModel.endMatch(id);
  }
}
