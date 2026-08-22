import crypto from 'crypto';

interface StoredState {
  createdAt: number;
  expiresAt: number;
}

const stateMap = new Map<string, StoredState>();

const STATE_TTL_MS = 10 * 60 * 1000;

function purgeExpiredStates() {
  const now = Date.now();
  for (const [state, meta] of stateMap.entries()) {
    if (meta.expiresAt < now) {
      stateMap.delete(state);
    }
  }
}

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

export function validateAndConsumeOAuthState(
  incomingState: string | null | undefined,
  cookieState?: string | null
): boolean {
  if (!incomingState) return false;

  purgeExpiredStates();

  const now = Date.now();

  const stored = stateMap.get(incomingState);
  if (stored) {
    stateMap.delete(incomingState);
    if (stored.expiresAt >= now) {
      return true;
    }
  }

  if (cookieState && incomingState === cookieState) {
    return true;
  }

  return false;
}
