import TeamModel from '../models/TeamModel';
import MatchModel from '../models/MatchModel';
import {
  MatchProgressInterface as IMat,
  TeamInterface as ITeam,
  PerformanceInterface,
} from '../interfaces/LeaderboardInterfaces';

type goalKey = 'homeTeamGoals' | 'awayTeamGoals';

export default class LeaderboardService {
  constructor(
    private match = new MatchModel(),
    private team = new TeamModel(),
  ) { }

  static setTotals(leaderboard: IMat[], occurrence = ''): number {
    const total = (t?:string, n = 1) => leaderboard.filter((match) => {
      switch (t) {
        case 'victories': return match.homeTeamGoals > match.awayTeamGoals;
        case 'draws': return match.homeTeamGoals === match.awayTeamGoals;
        case 'losses': return match.homeTeamGoals < match.awayTeamGoals;
        default: return true;
      }
    }).length * n;

    switch (occurrence) {
      case 'victories': return Number(total('victories', 3));
      case 'draws': return Number(total('draws'));
      case 'losses': return Number(total('losses'));
      case 'points': return Number(total('victories', 3) + total('draws'));
      case 'eficiency': return Number(
        (((total('victories', 3) + total('draws')) / total()) * (100 / 3)).toPrecision(4),
      );
      default: return Number(total());
    }
  }

  static setTeamsLeaderboard(leaderboard: IMat[], allTeams: ITeam[], home: boolean) {
    const isHome = home ? 'homeTeamId' : 'awayTeamId';
    return allTeams.map((team) => {
      const teamsLeaderboard = leaderboard.filter((t) => t[isHome] === t.id);
      const goals = (t: goalKey): number => teamsLeaderboard.reduce((a, match) => a + match[t], 0);
      return {
        ...team,
        name: team.teamName,
        totalGames: LeaderboardService.setTotals(teamsLeaderboard),
        goalsFavor: goals('homeTeamGoals'),
        goalsOwn: goals('awayTeamGoals'),
        totalVictories: LeaderboardService.setTotals(teamsLeaderboard, 'victories'),
        totalDraws: LeaderboardService.setTotals(teamsLeaderboard, 'draws'),
        totalLosses: LeaderboardService.setTotals(teamsLeaderboard, 'losses'),
        totalPoints: LeaderboardService.setTotals(teamsLeaderboard, 'points'),
        goalsBalance: goals('homeTeamGoals') - goals('awayTeamGoals'),
        efficiency: LeaderboardService.setTotals(teamsLeaderboard, 'eficiency'),
      };
    });
  }

  static sortLeaderboard(leaderboard: PerformanceInterface[]) {
    return leaderboard.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (a.totalVictories !== b.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      return b.goalsFavor - a.goalsFavor;
    });
  }

  async getLeaderboardHomeTeams() {
    const leaderboard = await this.match.getMatchesInProgress(false);
    const allTeams = await this.team.getAllTeams();
    const homeTeam = true;

    const allHomeTeams = LeaderboardService
      .setTeamsLeaderboard(leaderboard, allTeams, homeTeam);

    const sortedLeaderboard = LeaderboardService.sortLeaderboard(allHomeTeams);
    return sortedLeaderboard;
  }

  async getLeaderboardAwayTeams() {
    const leaderboard = await this.match.getMatchesInProgress(false);
    const allTeams = await this.team.getAllTeams();
    const homeTeam = false;

    const allHomeTeams = LeaderboardService
      .setTeamsLeaderboard(leaderboard, allTeams, homeTeam);

    const sortedLeaderboard = LeaderboardService.sortLeaderboard(allHomeTeams);
    return sortedLeaderboard;
  }

  static setTeamsPerformance(homeTeam: PerformanceInterface[], awayTeam: PerformanceInterface[]) {
    return homeTeam.map((team) => {
      const awayPerformance = awayTeam.find((t) => t.name === team.name) as PerformanceInterface;
      return {
        ...team,
        totalGames: team.totalGames + awayPerformance.totalGames,
        totalVictories: team.totalVictories + awayPerformance.totalVictories,
        totalDraws: team.totalDraws + awayPerformance.totalDraws,
        totalLosses: team.totalLosses + awayPerformance.totalLosses,
        totalPoints: team.totalPoints + awayPerformance.totalPoints,
        goalsFavor: team.goalsFavor + awayPerformance.goalsFavor,
        goalsOwn: team.goalsOwn + awayPerformance.goalsOwn,
        goalsBalance: 0,
        efficiency: 0,
      };
    });
  }

  async getLeaderboardAllTeams() {
    const homeTeams = await this.getLeaderboardHomeTeams();
    const awayTeams = await this.getLeaderboardAwayTeams();

    const allTeams = LeaderboardService.setTeamsPerformance(homeTeams, awayTeams)
      .map((team) => ({
        ...team,
        goalsBalance: team.goalsFavor - team.goalsOwn,
        efficiency: Number((((team.totalPoints / team.totalGames) * 100) / 3).toPrecision(4)),
      }));

    const orderAllTeams = LeaderboardService.sortLeaderboard(allTeams);
    return orderAllTeams;
  }
}
