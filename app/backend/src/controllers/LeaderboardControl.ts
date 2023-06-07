import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardControl {
  constructor(private readonly leaderboardService = new LeaderboardService()) { }

  async getLeaderboardHomeTeams(_req: Request, res: Response) {
    const leaderboard = await this.leaderboardService.getLeaderboardHomeTeams();
    res.status(StatusCodes.OK).json(leaderboard);
  }

  async getLeaderboardAwayTeams(_req: Request, res: Response) {
    const leaderboard = await this.leaderboardService.getLeaderboardAwayTeams();
    res.status(StatusCodes.OK).json(leaderboard);
  }

  async getLeaderboardAllTeams(_req: Request, res: Response) {
    const leaderboard = await this.leaderboardService.getLeaderboardAllTeams();
    res.status(StatusCodes.OK).json(leaderboard);
  }
}
