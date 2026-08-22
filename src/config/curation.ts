import { ProjectCategory, ProjectVisibility } from '@/types/build';

export interface ProjectCurationRule {
  repoName: string;
  displayName?: string;
  tagline?: string;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  status: 'completed' | 'under-construction';
  featured?: boolean;
  highlights?: string[];
  metrics?: Array<{ label: string; value: string }>;
  customLiveUrl?: string;
  progressPercent?: number;
  currentState?: string;
  expectedMilestone?: string;
}

/**
 * Editorial Curation Layer for Raghav Gupta's Real GitHub Repositories (@RaghavGupta2910)
 *
 * Source of Truth: GitHub account @RaghavGupta2910
 * Curation Filter: Promotes authentic repositories with engineering highlights.
 */
export const GITHUB_CURATION_RULES: ProjectCurationRule[] = [
  {
    repoName: 'nifty50-quant-model',
    displayName: 'Nifty50 Quantitative ML Trading System',
    tagline: 'End-to-End Ensemble Machine Learning & Regime-Aware Risk Architecture',
    category: 'systems',
    visibility: 'featured',
    status: 'completed',
    featured: true,
    highlights: [
      'Engineered a hybrid tree-based and deep-learning ensemble model for systematic index forecasting',
      'Implemented dynamic regime-aware risk overlay ensuring capital preservation during volatile downturns',
      'Drawdown-controlled exposure strategy that stays in cash unless ensemble signals align with favorable market regimes',
    ],
    metrics: [
      { label: 'Domain', value: 'Quantitative ML' },
      { label: 'Asset', value: 'Nifty50 Index' },
      { label: 'Method', value: 'Ensemble + Regime' },
    ],
  },
  {
    repoName: 'RideSharing-Optimizer',
    displayName: 'RideSharing Genetic Algorithm Optimizer',
    tagline: 'Spatial Optimization & Real-Time Driver-Rider Assignment Simulation',
    category: 'algorithms',
    visibility: 'featured',
    status: 'completed',
    featured: true,
    highlights: [
      'Interactive spatial web application utilizing Genetic Algorithms to solve NP-hard driver-rider routing',
      'Utilizes real NYC geographic coordinates from Kaggle Uber pickup datasets for authentic constraint modeling',
      'Real-time visualization animating population generation convergence toward global minimum-distance solutions',
    ],
    metrics: [
      { label: 'Algorithm', value: 'Genetic / Heuristic' },
      { label: 'Dataset', value: 'NYC Uber Geodata' },
      { label: 'Platform', value: 'Interactive Web' },
    ],
  },
  {
    repoName: 'RegularExpression_Equivalence_And_StringGeneration',
    displayName: 'Regular Expression & DFA Automata Engine',
    tagline: 'Theoretical Computation, Minimized DFAs & Language Equivalence Engine',
    category: 'algorithms',
    visibility: 'featured',
    status: 'completed',
    featured: true,
    highlights: [
      'Advanced automata compilation pipeline transforming regex syntax into state-minimized simulating DFAs',
      'Interactive step-by-step visual animation demonstrating BFS subset construction from NFAs',
      'Deterministic language-equivalence verification engine using Cartesian product automata construction',
    ],
    metrics: [
      { label: 'Theory', value: 'Automata & Formal Lang' },
      { label: 'Engine', value: 'DFA Minimizer' },
    ],
  },
  {
    repoName: 'MovieApp-ReactNative',
    displayName: 'Cinematic Movie Explorer Mobile App',
    tagline: 'Cross-Platform React Native Expo Application with TMDB Streaming API',
    category: 'graphics',
    visibility: 'completed',
    status: 'completed',
    featured: false,
    highlights: [
      'Cross-platform mobile client engineered with React Native and Expo framework',
      'Seamless TMDB API integration providing real-time movie search, discovery, and metadata streaming',
    ],
    metrics: [
      { label: 'Stack', value: 'React Native / Expo' },
      { label: 'Language', value: 'TypeScript' },
    ],
  },
  {
    repoName: 'Hire-Me-Recruitment-Management-System',
    displayName: 'Recruitment & Candidate Workflow Platform',
    tagline: 'Full-Stack Candidate Pipeline & Applicant Tracking Architecture',
    category: 'systems',
    visibility: 'completed',
    status: 'completed',
    featured: false,
    highlights: [
      'Comprehensive candidate management and applicant tracking workflow engine',
      'Structured database schema with multi-stage interview scheduling and candidate evaluations',
    ],
    metrics: [
      { label: 'Language', value: 'Python' },
      { label: 'Domain', value: 'Full-Stack System' },
    ],
  },
  {
    repoName: 'LearningDSA',
    displayName: 'C++ Algorithmic Archive & Problem Solutions',
    tagline: 'Modular Data Structures & Algorithms Problem Repository',
    category: 'algorithms',
    visibility: 'completed',
    status: 'completed',
    featured: false,
    highlights: [
      'Comprehensive C++ implementations organized systematically by algorithmic topic',
      'Core focus on dynamic programming, trees, graph algorithms, and asymptotic runtime optimizations',
    ],
    metrics: [
      { label: 'Language', value: 'C++20' },
      { label: 'Domain', value: 'DSA & Algorithms' },
    ],
  },
  {
    repoName: 'Heart_Disease_Prediction',
    displayName: 'Cardiovascular Diagnostic ML Predictor',
    tagline: 'Supervised Clinical Classification & Risk Assessment Model',
    category: 'systems',
    visibility: 'completed',
    status: 'completed',
    featured: false,
    highlights: [
      'Supervised classification model trained on clinical biometric datasets to predict cardiovascular risk',
      'Feature correlation analysis and cross-validation performance evaluation',
    ],
    metrics: [
      { label: 'Domain', value: 'Healthcare ML' },
      { label: 'Stack', value: 'Python / Jupyter' },
    ],
  },
  {
    repoName: 'RaghavGupta2910',
    visibility: 'hidden',
    category: 'systems',
    status: 'completed',
  },
  {
    repoName: 'LearnJs_smallprojects',
    visibility: 'hidden',
    category: 'systems',
    status: 'completed',
  },
  {
    repoName: 'LearnWebBasics',
    visibility: 'hidden',
    category: 'systems',
    status: 'completed',
  },
];
