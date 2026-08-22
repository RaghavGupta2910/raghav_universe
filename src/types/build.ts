export type ProjectStatus = 'completed' | 'under-construction';

export type ProjectVisibility = 'featured' | 'completed' | 'under-construction' | 'hidden';

export type ProjectCategory = 'systems' | 'algorithms' | 'graphics' | 'dsp' | 'fullstack';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface CompletedProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'completed';
  featured: boolean;
  visibility: ProjectVisibility;
  category: ProjectCategory;
  technologies: string[];
  repoUrl: string;
  liveUrl?: string;
  visual?: string;
  metrics?: ProjectMetric[];
  highlights: string[];
}

export interface UnderConstructionProject {
  id: string;
  name: string;
  currentState: string;
  technologies: string[];
  shortDescription: string;
  status: 'under-construction';
  visibility: ProjectVisibility;
  category: ProjectCategory;
  repoUrl?: string;
  liveUrl?: string;
  progressPercent?: number;
  expectedMilestone?: string;
}

export interface BuildWorldData {
  overview: string;
  completed: CompletedProject[];
  underConstruction: UnderConstructionProject[];
}
