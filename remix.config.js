const isDev = process.env.NODE_ENV === 'development';
const isLocal = process.env.BUILD_ENV === 'local';

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: isLocal ? undefined : 'vercel',
  server: isDev || isLocal ? undefined : './server.js',
  ignoredRouteFiles: ['.*'],
};
