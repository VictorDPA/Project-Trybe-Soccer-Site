import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TeamService from '../services/TeamService';

export default class TeamControl {
  constructor(private readonly teamService = new TeamService()) {}

  async getAllTeams(_req: Request, res: Response) {
    const teams = await this.teamService.getAllTeams();
    res.status(StatusCodes.OK).json(teams);
  }

  async getOneTeam(req: Request, res: Response) {
    const id = Number(req.params.id);
    const team = await this.teamService.getOneTeam(id);
    res.status(StatusCodes.OK).json(team);
  }
}
