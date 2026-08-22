import { IdentityWorldData } from '@/types/identity';
import { HANDLES_CONFIG } from '@/config/handles';

export const IDENTITY_DATA: IdentityWorldData = {
  name: 'RAGHAV GUPTA',
  field: 'Mathematics & Computing',
  location: 'Delhi, India',
  coordinatesDisplay: '28.6139° N, 77.2090° E // DEL',
  systemId: 'SOLARIS-RG',
  socials: {
    github: HANDLES_CONFIG.github.profileUrl,
    linkedin: 'https://www.linkedin.com/in/raghav-gupta-735365317/',
    codeforces: HANDLES_CONFIG.codeforces.profileUrl,
    leetcode: HANDLES_CONFIG.leetcode.profileUrl,
    email: 'raghavgupta291024@gmail.com',
  },
};
