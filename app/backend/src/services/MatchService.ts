import { StatusCodes } from 'http-status-codes';
import ErrorLaunch from '../utils/ErrorLaunch';
import TeamModel from '../models/TeamModel';
import MatchModel from '../models/MatchModel';
import MatchInterface from '../interfaces/MatchInterfaces';

export default class MatchService {
  constructor(
    private matchModel = new MatchModel(),
    private teamModel = new TeamModel(),
  ) {}

  async getAllMatches(inProgress: string | undefined) {
    const progress = inProgress === 'true';
    const matches = await (inProgress !== undefined
      ? this.matchModel.getMatchesInProgress(progress)
      : this.matchModel.getAllMatches());

    return matches;
  }

  async createMatch(match: MatchInterface) {
    const [homeTeam, awayTeam] = await Promise.all([
      this.teamModel.getOneTeam(match.homeTeamId),
      this.teamModel.getOneTeam(match.awayTeamId),
    ]);

    if (!homeTeam || !awayTeam) {
      throw new ErrorLaunch(StatusCodes.NOT_FOUND, 'There is no team with such id!');
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
