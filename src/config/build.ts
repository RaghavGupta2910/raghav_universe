import { BuildWorldData } from '@/types/build';

/**
 * Empty default model for Build world.
 *
 * Adheres strictly to the Data Correctness Rule:
 * Contains NO fabricated project names, fake metrics, or invented architectures.
 * Populated exclusively by live GitHub repositories belonging to Raghav.
 */
export const BUILD_DATA: BuildWorldData = {
  overview:
    'Software engineering systems and architectural artifacts built from first principles. Sourced directly from GitHub.',
  completed: [],
  underConstruction: [],
};
