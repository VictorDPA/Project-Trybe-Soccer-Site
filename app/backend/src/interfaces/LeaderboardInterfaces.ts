interface PerformanceInterface {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number,
}

interface TeamInterface {
  id?: number,
  teamName: string,
}

interface MatchProgressInterface {
  homeTeamId: number,
  homeTeamGoals: number,
  awayTeamId: number,
  awayTeamGoals: number,
  inProgress: boolean,
  id?: number,
}

export { PerformanceInterface, TeamInterface, MatchProgressInterface };
