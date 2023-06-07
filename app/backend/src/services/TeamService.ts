import TeamModel from '../models/TeamModel';

export default class TeamService {
  constructor(private readonly teamModel = new TeamModel()) {}

  public async getAllTeams() {
    const teams = await this.teamModel.getAllTeams();
    return teams;
  }

  public async getOneTeam(id: number) {
    const team = await this.teamModel.getOneTeam(id);
    return team;
  }
}
