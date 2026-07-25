import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const server = app.listen(env.PORT, () => logger.info({ port: env.PORT }, 'VyapaarSathi API listening'));
server.requestTimeout = 15_000;
server.headersTimeout = 16_000;
process.on('SIGTERM', () => server.close(() => process.exit(0)));
