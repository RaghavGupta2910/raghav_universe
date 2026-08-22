export type GoalStatus = 'future' | 'in-progress' | 'achieved';

export interface LeetCodeStats {
  rating: number;
  maxRating: number;
  rank: string; // e.g. "Top 18.2%"
  solvedCount: number;
  profileUrl: string;
  breakdown: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

export interface FrontierTarget {
  id: string;
  title: string;
  platformOrDomain: string; // e.g. "Codeforces", "ICPC", "Advanced Trees"
  description: string;
  status: GoalStatus;
  currentRatingOrProgress?: string; // e.g. "Pupil -> Specialist (1400+)"
  progressPercent?: number;
  targetMilestone: string;
  completedDate?: string;
}

export interface TopicDistribution {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CodeWorldData {
  totalSolved: number;
  overview: string;
  learningFocus: string;
  updatedAt: string;
  dataSource: {
    provider: 'codolio-adapter' | 'leetcode-api' | 'manual-verified';
    lastSyncTimestamp: string;
  };
  leetcode: LeetCodeStats;
  topics: TopicDistribution[];
  nextFrontier: FrontierTarget[];
}
