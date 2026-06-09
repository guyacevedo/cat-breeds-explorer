import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[server] API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('[server] Failed to start', err);
  process.exit(1);
});
