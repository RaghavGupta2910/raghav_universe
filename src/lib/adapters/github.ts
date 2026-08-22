import { BuildWorldData, CompletedProject, UnderConstructionProject } from '@/types/build';
import { BUILD_DATA } from '@/config/build';
import { GITHUB_CURATION_RULES } from '@/config/curation';

export interface GitHubRawRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  fork: boolean;
}

export interface GitHubSyncResult {
  success: boolean;
  source: 'live-github' | 'curated-fallback';
  data: BuildWorldData;
  starsTotal: number;
  syncedCount: number;
  error?: string;
}

/**
 * Real Server-Side GitHub Data Adapter
 *
 * Fetches public repositories from the unauthenticated GitHub REST API with 1-hour ISR cache.
 * Applies the curation layer so only intentional, curated projects appear in the BUILD exhibition.
 */
import { HANDLES_CONFIG } from '@/config/handles';

export async function fetchGitHubProjects(
  username: string = HANDLES_CONFIG.github.username
): Promise<GitHubSyncResult> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'RaghavUniverse-Portfolio',
      },
      next: { revalidate: 3600 }, // 1-hour server-side cache
    });

    if (!res.ok) {
      return {
        success: false,
        source: 'curated-fallback',
        data: BUILD_DATA,
        starsTotal: 0,
        syncedCount: BUILD_DATA.completed.length + BUILD_DATA.underConstruction.length,
        error: `GitHub API returned ${res.status}: ${res.statusText}`,
      };
    }

    const repos: GitHubRawRepo[] = await res.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      return {
        success: true,
        source: 'curated-fallback',
        data: BUILD_DATA,
        starsTotal: 0,
        syncedCount: BUILD_DATA.completed.length + BUILD_DATA.underConstruction.length,
      };
    }

    // Merge live repo data with curation rules
    const completedList: CompletedProject[] = [];
    const underConstructionList: UnderConstructionProject[] = [];
    let totalStars = 0;

    for (const rule of GITHUB_CURATION_RULES) {
      if (rule.visibility === 'hidden') continue;

      const liveRepo = repos.find(
        (r) => r.name.toLowerCase() === rule.repoName.toLowerCase()
      );

      const technologies = liveRepo?.language
        ? [liveRepo.language, ...(liveRepo.topics || [])]
        : ['TypeScript', 'Software Architecture'];

      if (liveRepo) {
        totalStars += liveRepo.stargazers_count;
      }

      if (rule.status === 'completed') {
        completedList.push({
          id: rule.repoName,
          name: rule.displayName || liveRepo?.name || rule.repoName,
          tagline: rule.tagline || 'Engineered Software System',
          description: liveRepo?.description || 'Production system engineered from first principles.',
          status: 'completed',
          featured: !!rule.featured,
          visibility: rule.visibility,
          category: rule.category,
          technologies,
          repoUrl: liveRepo?.html_url || `https://github.com/${username}/${rule.repoName}`,
          liveUrl: rule.customLiveUrl || liveRepo?.homepage || undefined,
          metrics: rule.metrics,
          highlights: rule.highlights || ['Verified architectural implementation'],
        });
      } else {
        underConstructionList.push({
          id: rule.repoName,
          name: rule.displayName || liveRepo?.name || rule.repoName,
          currentState: rule.currentState || 'Core Architecture & Implementation',
          shortDescription: liveRepo?.description || 'System in active development in the workshop.',
          technologies,
          status: 'under-construction',
          visibility: rule.visibility,
          category: rule.category,
          repoUrl: liveRepo?.html_url || `https://github.com/${username}/${rule.repoName}`,
          liveUrl: rule.customLiveUrl || liveRepo?.homepage || undefined,
          progressPercent: rule.progressPercent || 50,
          expectedMilestone: rule.expectedMilestone,
        });
      }
    }

    const mergedData: BuildWorldData = {
      overview: BUILD_DATA.overview,
      completed: completedList.length > 0 ? completedList : BUILD_DATA.completed,
      underConstruction:
        underConstructionList.length > 0 ? underConstructionList : BUILD_DATA.underConstruction,
    };

    return {
      success: true,
      source: 'live-github',
      data: mergedData,
      starsTotal: totalStars,
      syncedCount: completedList.length + underConstructionList.length,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown GitHub fetch error';
    return {
      success: false,
      source: 'curated-fallback',
      data: BUILD_DATA,
      starsTotal: 0,
      syncedCount: BUILD_DATA.completed.length + BUILD_DATA.underConstruction.length,
      error: message,
    };
  }
}
