import childProcess from 'child_process';
import { promisify } from 'util';

import fetch from '@remix-run/web-fetch';
import yargsParser from 'yargs-parser';

import logger from 'scripts/logger';

const clientID = process.env.SPOTIFY_CLIENT_ID ?? '';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';
const redirectURI = 'https://rofisyahrul.com/callback';

const authScopes =
  process.env.SPOTIFY_AUTH_SCOPES ||
  'user-read-private user-read-currently-playing';

const exec = promisify(childProcess.exec);

async function authorize() {
  const searchParams = new URLSearchParams({
    client_id: clientID,
    response_type: 'code',
    redirect_uri: redirectURI,
    scope: authScopes,
  });

  const endpoint = 'https://accounts.spotify.com/authorize';
  const url = `${endpoint}?${searchParams.toString()}`;

  await exec(`open "${url}"`);
}

async function fetchRefreshToken(code: string): Promise<string> {
  const endpoint = 'https://accounts.spotify.com/api/token';
  const token = Buffer.from(`${clientID}:${clientSecret}`).toString(
    'base64',
  );

  const response = await fetch(endpoint, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectURI,
    }),
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();
  return data.refresh_token;
}

async function getRefreshToken() {
  const { code } = yargsParser(process.argv.slice(2));

  if (!code) {
    await authorize();
    logger.info(
      `Let's login with your spotify account, copy the code from callback URL.
      Then run "yarn get-spotify-refresh-token --code=<copied-code>"`,
    );
    return;
  }

  try {
    const refreshToken = await fetchRefreshToken(code);
    logger.success(`Refresh Token: ${refreshToken}`);
  } catch (error) {
    logger.error(
      `Error on fetching Spotify refresh token. Error: ${error?.message}`,
    );
    process.exit(1);
  }
}

getRefreshToken();
