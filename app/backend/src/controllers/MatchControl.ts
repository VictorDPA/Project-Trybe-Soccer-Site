import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import MatchService from '../services/MatchService';

export default class MatchControl {
  constructor(private readonly matchService = new MatchService()) { }

  async getAllMatches(req: Request, res: Response) {
    const inProgress = Boolean(req.query.inProgress);
    const matches = await this.matchService
      .getAllMatches(String(inProgress));
    res.status(StatusCodes.OK).json(matches);
  }

  async createMatch(req: Request, res: Response) {
    const data = req.body;
    const match = await this.matchService.createMatch(data);
    res.status(StatusCodes.CREATED).json(match);
  }

  async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const updatedMatch = await this.matchService
      .updateMatch(Number(id), homeTeamGoals, awayTeamGoals);

    res.status(StatusCodes.OK).json(updatedMatch);
  }

  async endMatch(req: Request, res: Response) {
    const { id } = req.params;
    await this.matchService.endMatch(Number(id));
    res.status(StatusCodes.OK).json({ message: 'Finished' });
  }
}
