import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './api/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const supabaseConfigured = Boolean(
      (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim().startsWith('http') &&
        (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim().length > 20
    );
    console.log(
      `GiantGreen EcoTech server running on http://0.0.0.0:${PORT} (Mode: ${
        isProduction ? 'production' : 'development'
      }, Supabase: ${supabaseConfigured ? 'configured' : 'unconfigured'})`
    );
  });
}

startServer();
