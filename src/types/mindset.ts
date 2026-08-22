export interface VerifiedInfluence {
  id: string;
  name: string;
  role: string;
  verifiedQuote: string;
  attribution: string;
  contextAndInterpretation: string;
}

export interface GrowthStage {
  stage: string;
  theme: string;
  description: string;
}

export interface MindsetWorldData {
  overview: string;
  theStandardStatement: string;
  influences: VerifiedInfluence[];
  theLongGame: GrowthStage[];
  personalPrinciplesNotes?: string;
}
