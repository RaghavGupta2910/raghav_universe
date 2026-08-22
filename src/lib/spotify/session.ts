import fs from 'fs';
import path from 'path';

export interface SpotifyPersistedSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope?: string;
  updatedAt: string;
}

const SESSION_FILE_PATH = path.join(process.cwd(), '.spotify_session.json');

/**
 * Saves Spotify tokens to a secure local file on the server.
 * This guarantees authorization persistence across browser domain differences (localhost vs 127.0.0.1)
 * and server restarts.
 */
export function saveServerSession(data: {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope?: string;
}): void {
  try {
    const session: SpotifyPersistedSession = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
      scope: data.scope,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session, null, 2), {
      encoding: 'utf-8',
      mode: 0o600, // Read/Write only by owner
    });
  } catch (err) {
    console.error('Failed to save Spotify session to disk:', err);
  }
}

/**
 * Loads the persisted Spotify session from the local server file.
 */
export function loadServerSession(): SpotifyPersistedSession | null {
  try {
    if (!fs.existsSync(SESSION_FILE_PATH)) {
      return null;
    }
    const content = fs.readFileSync(SESSION_FILE_PATH, 'utf-8');
    if (!content.trim()) return null;
    return JSON.parse(content) as SpotifyPersistedSession;
  } catch {
    return null;
  }
}

/**
 * Deletes the persisted Spotify session file upon disconnect.
 */
export function clearServerSession(): void {
  try {
    if (fs.existsSync(SESSION_FILE_PATH)) {
      fs.unlinkSync(SESSION_FILE_PATH);
    }
  } catch (err) {
    console.error('Failed to remove Spotify session from disk:', err);
  }
}
