import { CodeWorldData } from '@/types/code';

/**
 * Empty default model for Code world.
 *
 * Adheres strictly to the Data Correctness Rule:
 * Contains NO hardcoded statistics, fake ratings, or placeholder counts.
 * Populated exclusively by live server-side telemetry.
 */
export const CODE_DATA: CodeWorldData = {
  totalSolved: 0,
  overview: 'Algorithmic optimization, contest telemetry, and discrete mathematics encounters.',
  learningFocus: 'Competitive programming, graph invariants, and algorithmic optimization.',
  updatedAt: new Date().toISOString(),
  dataSource: {
    provider: 'codolio-adapter',
    lastSyncTimestamp: new Date().toISOString().split('T')[0],
  },
  leetcode: {
    rating: 0,
    maxRating: 0,
    rank: 'Unrated',
    solvedCount: 0,
    profileUrl: 'https://leetcode.com',
    breakdown: {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0,
    },
  },
  topics: [],
  nextFrontier: [],
};
