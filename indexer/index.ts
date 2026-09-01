import { MidnightEventWatcher } from './watcher';
import { createIndexerServer } from './server';

const PORT = process.env.PORT || 4000;

const watcher = new MidnightEventWatcher();
const app = createIndexerServer(watcher);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[ZkPass Indexer] Running on http://localhost:${PORT}`);
    console.log(`[ZkPass Indexer] Watching Midnight testnet for accessGranted events...`);
  });
}

export { watcher, app };
