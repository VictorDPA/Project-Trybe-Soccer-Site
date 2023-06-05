import TeamModel from '../models/TeamModel';

export default class TeamService {
  constructor(private teamModel = new TeamModel()) {}

  async getAllTeams() {
    const teams = await this.teamModel.getAllTeams();
    return teams;
  }

  async getOneTeam(id: number) {
    const team = await this.teamModel.getOneTeam(id);
    return team;
  }
}
