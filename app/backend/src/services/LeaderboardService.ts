import TeamModel from '../models/TeamModel';
import MatchModel from '../models/MatchModel';
import {
  MatchProgressInterface as IMat,
  TeamInterface as ITeam,
  PerformanceInterface as IPerf,
} from '../interfaces/LeaderboardInterfaces';

type goalKey = 'homeTeamGoals' | 'awayTeamGoals';

export default class LeaderboardService {
  constructor(
    private match = new MatchModel(),
    private team = new TeamModel(),
    private performance: IPerf = {
      name: '',
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    },
  ) { }

  // static setTotals(leaderboard: IMat[], occurrence = ''): number {
  //   const total = (t?:string, n = 1) => leaderboard.filter((match) => {
  //     switch (t) {
  //       case 'victories': return match.homeTeamGoals > match.awayTeamGoals;
  //       case 'draws': return match.homeTeamGoals === match.awayTeamGoals;
  //       case 'losses': return match.homeTeamGoals < match.awayTeamGoals;
  //       default: return true;
  //     }
  //   }).length * n;

  //   switch (occurrence) {
  //     case 'victories': return Number(total('victories', 3));
  //     case 'draws': return Number(total('draws'));
  //     case 'losses': return Number(total('losses'));
  //     case 'points': return Number(total('victories', 3) + total('draws'));
  //     case 'eficiency': return Number(
  //       (((total('victories', 3) + total('draws')) / total()) * (100 / 3)).toPrecision(4),
  //     );
  //     default: return Number(total());
  //   }
  // }
  setNotConditionalPerformanceData(team: ITeam, matchesPerTeam: IMat[]) {
    const { performance } = this;
    performance.name = team.teamName;
    performance.totalGames = matchesPerTeam.length;
    performance.goalsBalance = performance.goalsFavor - performance.goalsOwn;
    performance.efficiency = Number(
      ((performance.totalPoints / (performance.totalGames * 3)) * 100).toFixed(2),
    );
  }

  calculateTeamPerformance(team: ITeam, matchesPerTeam: IMat[], isHomeTeam: boolean) {
    const { performance } = this;
    matchesPerTeam.forEach((match) => {
      performance.goalsFavor += isHomeTeam ? match.homeTeamGoals : match.awayTeamGoals;
      performance.goalsOwn += isHomeTeam ? match.awayTeamGoals : match.homeTeamGoals;

      if ((isHomeTeam && match.homeTeamGoals > match.awayTeamGoals)
        || (!isHomeTeam && match.awayTeamGoals > match.homeTeamGoals)) {
        performance.totalVictories += 1;
        performance.totalPoints += 3;
      } else if ((isHomeTeam && match.homeTeamGoals < match.awayTeamGoals)
        || (!isHomeTeam && match.awayTeamGoals < match.homeTeamGoals)) {
        performance.totalLosses += 1;
      } else {
        performance.totalDraws += 1;
        performance.totalPoints += 1;
      }
    });

    this.setNotConditionalPerformanceData(team, matchesPerTeam);

    return performance;
  }

  setTeamsPerformance(allMatches: IMat[], allTeams: ITeam[], homeTeam: boolean) {
    const isHome = homeTeam ? 'homeTeamId' : 'awayTeamId';
    return allTeams.map((team) => {
      const matchesPerTeam = allMatches.filter((t) => t[isHome] === team.id);

      const performance = homeTeam
        ? this.calculateTeamPerformance(team, matchesPerTeam, true)
        : this.calculateTeamPerformance(team, matchesPerTeam, false);

      this.resetAtributePerformance();
      return performance;
    });
  }

  // static setTeamsLeaderboard(leaderboard: IMat[], allTeams: ITeam[], home: boolean) {
  //   const isHome = home ? 'homeTeamId' : 'awayTeamId';
  //   return allTeams.map((team) => {
  //     const teamsLeaderboard = leaderboard.filter((t) => t[isHome] === t.id);
  //     const goals = (t: goalKey): number => teamsLeaderboard.reduce((a, match) => a + match[t], 0);
  //     return {
  //       ...team,
  //       name: team.teamName,
  //       totalGames: LeaderboardService.setTotals(teamsLeaderboard),
  //       goalsFavor: goals('homeTeamGoals'),
  //       goalsOwn: goals('awayTeamGoals'),
  //       totalVictories: LeaderboardService.setTotals(teamsLeaderboard, 'victories'),
  //       totalDraws: LeaderboardService.setTotals(teamsLeaderboard, 'draws'),
  //       totalLosses: LeaderboardService.setTotals(teamsLeaderboard, 'losses'),
  //       totalPoints: LeaderboardService.setTotals(teamsLeaderboard, 'points'),
  //       goalsBalance: goals('homeTeamGoals') - goals('awayTeamGoals'),
  //       efficiency: LeaderboardService.setTotals(teamsLeaderboard, 'eficiency'),
  //     };
  //   });
  // }

  resetAtributePerformance() {
    this.performance = {
      name: '',
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    };
  }

  static setAllTeamsPerformance(homeTeam: IPerf[], awayTeam: IPerf[]) {
    return homeTeam.map((team) => {
      const awayPerformance = awayTeam.find((t) => t.name === team.name) as IPerf;
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

  static sortLeaderboard(leaderboard: IPerf[]) {
    return leaderboard.sort((a, b) => {
      switch (true) {
        case a.totalPoints !== b.totalPoints:
          return b.totalPoints - a.totalPoints;

        case a.totalVictories !== b.totalVictories:
          return b.totalVictories - a.totalVictories;

        case a.goalsBalance !== b.goalsBalance:
          return b.goalsBalance - a.goalsBalance;

        default: return b.goalsFavor - a.goalsFavor;
      }
    });
  }

  async getLeaderboardHomeTeams() {
    const [leaderboard, allTeams] = await Promise.all([
      this.match.getAllMatchesInProgressNoScope(false),
      this.team.getAllTeams(),
    ]);

    const homeTeam = true;

    const allHomeTeams = this.setTeamsPerformance(leaderboard, allTeams, homeTeam);

    const sortedLeaderboard = LeaderboardService.sortLeaderboard(allHomeTeams);
    return sortedLeaderboard;
  }

  async getLeaderboardAwayTeams() {
    const [leaderboard, allTeams] = await Promise.all([
      this.match.getAllMatchesInProgressNoScope(false),
      this.team.getAllTeams(),
    ]);
    const homeTeam = false;

    const allAwayTeams = this.setTeamsPerformance(leaderboard, allTeams, homeTeam);

    const sortedLeaderboard = LeaderboardService.sortLeaderboard(allAwayTeams);
    return sortedLeaderboard;
  }

  async getLeaderboardAllTeams() {
    const [homeTeams, awayTeams] = await Promise.all([
      this.getLeaderboardHomeTeams(),
      this.getLeaderboardAwayTeams(),
    ]);

    const allTeams = LeaderboardService.setAllTeamsPerformance(homeTeams, awayTeams)
      .map((team) => ({
        ...team,
        goalsBalance: team.goalsFavor - team.goalsOwn,
        efficiency: Number((((team.totalPoints / team.totalGames) * 100) / 3).toPrecision(4)),
      }));

    const orderAllTeams = LeaderboardService.sortLeaderboard(allTeams);
    return orderAllTeams;
  }
}
