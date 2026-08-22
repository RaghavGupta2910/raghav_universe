import crypto from 'crypto';

interface StoredState {
  createdAt: number;
  expiresAt: number;
}

// In-memory server state cache with 10-minute TTL
const stateMap = new Map<string, StoredState>();

const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Clean up expired states
 */
function purgeExpiredStates() {
  const now = Date.now();
  for (const [state, meta] of stateMap.entries()) {
    if (meta.expiresAt < now) {
      stateMap.delete(state);
    }
  }
}

/**
 * Generates and securely stores a new cryptographic OAuth state
 */
export function createAndStoreOAuthState(): string {
  purgeExpiredStates();

  const state = crypto.randomBytes(16).toString('hex');
  const now = Date.now();

  stateMap.set(state, {
    createdAt: now,
    expiresAt: now + STATE_TTL_MS,
  });

  return state;
}

/**
 * Validates and atomically consumes the OAuth state (single-use CSRF protection).
 * Accepts either a valid server-stored state or a matching cookie state.
 */
export function validateAndConsumeOAuthState(
  incomingState: string | null | undefined,
  cookieState?: string | null
): boolean {
  if (!incomingState) return false;

  purgeExpiredStates();

  const now = Date.now();

  // 1. Check Server-Side State Store
  const stored = stateMap.get(incomingState);
  if (stored) {
    // Delete immediately (single-use)
    stateMap.delete(incomingState);
    if (stored.expiresAt >= now) {
      return true;
    }
  }

  // 2. Check Cookie State as secondary fallback
  if (cookieState && incomingState === cookieState) {
    return true;
  }

  return false;
}
