export type CreativeCategory = 'music' | 'art';

export interface CreativePractice {
  id: string;
  category: CreativeCategory;
  name: string;
  medium: string;
  description: string;
  creativePhilosophy: string;
  visualMetaphor: string;
  studioNotes: string[];
}

export interface CreateWorldData {
  themeStatement: string;
  overview: string;
  categories: {
    music: CreativePractice[];
    art: CreativePractice[];
  };
}
