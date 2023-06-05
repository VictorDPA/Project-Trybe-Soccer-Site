import Team from '../database/models/Team';

export default class TeamModel {
  constructor(private team = Team) {}

  async getAllTeams() {
    const catchTeams = await this.team.findAll();
    return catchTeams;
  }

  async getOneTeam(id: number) {
    const catchTeam = await this.team.findByPk(id);
    return catchTeam;
  }
}
