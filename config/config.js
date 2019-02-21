export const config = {
  appListenPort: process.env.PORT || 3001,
  sessionIdCookieName: 'stiff_session_id',
  sessionSignSecret: 'iso siika karva hauki',
  redisAddress: process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379',
}
