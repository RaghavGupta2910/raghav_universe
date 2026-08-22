export interface IdentityWorldData {
  name: string;
  field: string;
  location: string;
  coordinatesDisplay: string;
  systemId: string;
  visualAsset?: string;
  socials: {
    github: string;
    linkedin: string;
    codeforces: string;
    leetcode: string;
    email: string;
  };
}
