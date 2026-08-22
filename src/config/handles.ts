/**
 * Canonical External Service Identity Handles & Environment Configuration
 *
 * Configured for Raghav Gupta:
 * - Codolio Slug: Raghav2910
 * - GitHub Handle: RaghavGupta2910
 * - LeetCode Handle: raghavgupta2910
 * - Codeforces Handle: raghavgupta291024
 */
export const HANDLES_CONFIG = {
  codolio: {
    userKey: process.env.CODOLIO_USER_KEY || 'Raghav2910',
    profileUrl: `https://codolio.com/profile/${process.env.CODOLIO_USER_KEY || 'Raghav2910'}`,
  },
  github: {
    username: process.env.GITHUB_USERNAME || 'RaghavGupta2910',
    profileUrl: `https://github.com/${process.env.GITHUB_USERNAME || 'RaghavGupta2910'}`,
  },
  leetcode: {
    username: process.env.LEETCODE_USERNAME || 'raghavgupta2910',
    profileUrl: `https://leetcode.com/${process.env.LEETCODE_USERNAME || 'raghavgupta2910'}`,
  },
  codeforces: {
    handle: process.env.CODEFORCES_HANDLE || 'raghavgupta291024',
    profileUrl: `https://codeforces.com/profile/${process.env.CODEFORCES_HANDLE || 'raghavgupta291024'}`,
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN || '',
    profileUrl: process.env.SPOTIFY_PROFILE_URL || 'https://open.spotify.com',
  },
};
