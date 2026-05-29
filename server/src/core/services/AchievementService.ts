import { IAchievementRepository } from '../repositories/IAchievementRepository.js';
import { queryOne } from '../../config/database.js';

export class AchievementService {
  constructor(
    private readonly achievementRepository: IAchievementRepository,
  ) {}

  async checkPredictionAchievements(userId: string, prediction: { id: string; totalScore: number }): Promise<string[]> {
    const unlocked: string[] = [];

    const predictionCount = await this.getPredictionCount(userId);
    const firstPrediction = await this.achievementRepository.findByKey('first_prediction');
    if (firstPrediction && predictionCount <= 1) {
      await this.awardAchievement(userId, firstPrediction.id);
      unlocked.push('first_prediction');
    }

    const century = await this.achievementRepository.findByKey('century');
    if (century && prediction.totalScore >= 100) {
      await this.awardAchievement(userId, century.id);
      unlocked.push('century');
    }

    return unlocked;
  }

  async checkPodiumAchievement(userId: string, exactPodium: boolean): Promise<string[]> {
    const unlocked: string[] = [];
    if (!exactPodium) return unlocked;

    const perfectPodium = await this.achievementRepository.findByKey('perfect_podium');
    if (perfectPodium) {
      await this.awardAchievement(userId, perfectPodium.id);
      unlocked.push('perfect_podium');
    }
    return unlocked;
  }

  async checkPoleAchievement(userId: string): Promise<string[]> {
    const unlocked: string[] = [];
    const polePerfect = await this.achievementRepository.findByKey('pole_perfect');
    if (polePerfect) {
      await this.awardAchievement(userId, polePerfect.id);
      unlocked.push('pole_perfect');
    }
    return unlocked;
  }

  async checkWinnerAchievement(userId: string): Promise<string[]> {
    const unlocked: string[] = [];
    const raceWinner = await this.achievementRepository.findByKey('race_winner');
    if (raceWinner) {
      await this.awardAchievement(userId, raceWinner.id);
      unlocked.push('race_winner');
    }
    return unlocked;
  }

  async checkTripleCorrectAchievement(userId: string, poleCorrect: boolean, winnerCorrect: boolean, fastestLapCorrect: boolean): Promise<string[]> {
    const unlocked: string[] = [];
    if (!poleCorrect || !winnerCorrect || !fastestLapCorrect) return unlocked;

    const invictus = await this.achievementRepository.findByKey('invictus');
    if (invictus) {
      await this.awardAchievement(userId, invictus.id);
      unlocked.push('invictus');
    }
    return unlocked;
  }

  async checkTop10KingAchievement(userId: string, perfectTop10Count: number): Promise<string[]> {
    const unlocked: string[] = [];
    if (perfectTop10Count < 5) return unlocked;

    const top10King = await this.achievementRepository.findByKey('top10_king');
    if (top10King) {
      await this.awardAchievement(userId, top10King.id);
      unlocked.push('top10_king');
    }
    return unlocked;
  }

  async checkFullSeasonAchievement(userId: string, seasonId: string): Promise<string[]> {
    const unlocked: string[] = [];

    const totalRaces = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM races WHERE season_id = $1 AND status = $2',
      [seasonId, 'completed'],
    );
    if (!totalRaces) return unlocked;

    const predictedRaces = await queryOne<{ count: string }>(
      `SELECT COUNT(DISTINCT p.race_id) as count FROM predictions p
       JOIN races r ON r.id = p.race_id
       WHERE p.user_id = $1 AND r.season_id = $2 AND r.status = 'completed'`,
      [userId, seasonId],
    );
    if (!predictedRaces) return unlocked;

    if (parseInt(predictedRaces.count, 10) >= parseInt(totalRaces.count, 10)) {
      const fullSeason = await this.achievementRepository.findByKey('full_season');
      if (fullSeason) {
        await this.awardAchievement(userId, fullSeason.id);
        unlocked.push('full_season');
      }
    }
    return unlocked;
  }

  async checkStreakAchievements(userId: string, currentStreak: number): Promise<string[]> {
    const unlocked: string[] = [];

    const streakTargets = [
      { key: 'streak_3', count: 3 },
      { key: 'streak_5', count: 5 },
      { key: 'streak_10', count: 10 },
    ];

    for (const target of streakTargets) {
      if (currentStreak >= target.count) {
        const achievement = await this.achievementRepository.findByKey(target.key);
        if (achievement) {
          await this.awardAchievement(userId, achievement.id);
          unlocked.push(target.key);
        }
      }
    }

    return unlocked;
  }

  async checkFantasyAchievements(userId: string): Promise<string[]> {
    const unlocked: string[] = [];

    const fantasyTeam = await queryOne<{ total_score: string }>(
      'SELECT total_score FROM fantasy_teams WHERE user_id = $1 ORDER BY total_score DESC LIMIT 1',
      [userId],
    );
    if (!fantasyTeam) return unlocked;

    const fantasyScore = parseFloat(fantasyTeam.total_score);

    if (fantasyScore >= 500) {
      const fantasy500 = await this.achievementRepository.findByKey('fantasy_500');
      if (fantasy500) {
        await this.awardAchievement(userId, fantasy500.id);
        unlocked.push('fantasy_500');
      }
    }

    if (fantasyScore >= 1000) {
      const fantasy1000 = await this.achievementRepository.findByKey('fantasy_1000');
      if (fantasy1000) {
        await this.awardAchievement(userId, fantasy1000.id);
        unlocked.push('fantasy_1000');
      }
    }

    return unlocked;
  }

  async checkSpecialAchievements(userId: string): Promise<string[]> {
    const unlocked: string[] = [];

    const leagueWin = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM league_members lm
       JOIN leagues l ON l.id = lm.league_id
       WHERE lm.user_id = $1 AND lm.role = 'owner'`,
      [userId],
    );

    const leagueWinner = await this.achievementRepository.findByKey('league_winner');
    if (leagueWinner && leagueWin && parseInt(leagueWin.count, 10) > 0) {
      await this.awardAchievement(userId, leagueWinner.id);
      unlocked.push('league_winner');
    }

    const rainMaster = await this.achievementRepository.findByKey('rain_master');
    if (rainMaster && await this.isRainMaster(userId)) {
      await this.awardAchievement(userId, rainMaster.id);
      unlocked.push('rain_master');
    }

    return unlocked;
  }

  async awardAchievement(userId: string, achievementId: string): Promise<boolean> {
    try {
      const existing = await queryOne<Record<string, unknown>>(
        'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
        [userId, achievementId],
      );
      if (existing) return false;

      await this.achievementRepository.unlock(userId, achievementId);
      return true;
    } catch {
      return false;
    }
  }

  private async getPredictionCount(userId: string): Promise<number> {
    const result = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM predictions WHERE user_id = $1',
      [userId],
    );
    return result ? parseInt(result.count, 10) : 0;
  }

  private async isRainMaster(userId: string): Promise<boolean> {
    const result = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM prediction_scores ps
       JOIN predictions p ON p.id = ps.prediction_id
       JOIN races r ON r.id = p.race_id
       WHERE p.user_id = $1
       AND r.weather_forecast->>'condition' = 'wet'
       AND ps.total_score >= 50`,
      [userId],
    );
    return result ? parseInt(result.count, 10) > 0 : false;
  }
}
