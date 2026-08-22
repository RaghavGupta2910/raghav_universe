export type CreativeCategory = 'music' | 'art' | 'movement';

export interface CreativePractice {
  id: string;
  category: CreativeCategory;
  name: string;
  medium: string; // e.g. "Acoustic Piano & Keyboards", "Paper Filigree", "Court Agility"
  description: string;
  creativePhilosophy: string;
  visualMetaphor: string;
  studioNotes: string[];
}

export interface CreateWorldData {
  themeStatement: string; // "Not everything I create has code in it."
  overview: string;
  categories: {
    music: CreativePractice[];
    art: CreativePractice[];
    movement: CreativePractice[];
  };
}
