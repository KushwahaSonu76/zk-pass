import express, { Request, Response } from 'express';
import cors from 'cors';
import { MidnightEventWatcher } from './watcher';

export function createIndexerServer(watcher: MidnightEventWatcher) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      service: 'ZkPass Core Event Indexer',
      network: 'Midnight Testnet',
      timestamp: new Date().toISOString(),
    });
  });

  // Query live verifications API
  app.get('/api/events', (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 20;
    res.json({
      success: true,
      events: watcher.getEvents(limit),
      stats: watcher.getStats(),
    });
  });

  // Check specific proof hash status endpoint
  app.get('/api/verification-status/:proofHash', (req: Request, res: Response) => {
    const { proofHash } = req.params;
    const record = watcher.getStatusByProofHash(proofHash);

    if (!record) {
      res.status(404).json({
        success: false,
        message: 'Proof hash not found on Midnight ledger indexer',
      });
      return;
    }

    res.json({
      success: true,
      accessGranted: record.accessGranted,
      proofHash: record.proofHash,
      blockHeight: record.blockHeight,
      timestamp: record.timestamp,
      privacyModel: {
        identityExposed: false,
        walletAddressExposed: false,
        credentialIndexExposed: false,
      },
    });
  });

  return app;
}
