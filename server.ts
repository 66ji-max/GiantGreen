import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure data directory exists for persistent inquiries
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CONTACTS_FILE = path.join(DATA_DIR, 'contact_messages.json');
const DEMO_REQUESTS_FILE = path.join(DATA_DIR, 'demo_requests.json');

// Initialize JSON files if they don't exist
if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2), 'utf8');
}
if (!fs.existsSync(DEMO_REQUESTS_FILE)) {
  fs.writeFileSync(DEMO_REQUESTS_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Middleware
app.use(express.json());

// Helper to generate formatted reference ID
function generateReferenceId(prefix: 'DEMO' | 'MSG'): string {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
  return `GG-${prefix}-${yearMonth}-${randomSuffix}`;
}

// Simple email regex for server validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contact
 * Handles Contact Us inquiries
 */
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, message, honeypot } = req.body;

    // Honeypot check for bots
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(400).json({ error: 'Spam detected' });
    }

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide a message with at least 5 characters.' });
    }

    const referenceId = generateReferenceId('MSG');
    const timestamp = new Date().toISOString();

    const record = {
      referenceId,
      timestamp,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    };

    // Save record to local JSON storage
    try {
      const data = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf8'));
      data.push(record);
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (saveErr) {
      console.error('Failed to append to contact_messages.json:', saveErr);
    }

    // Optional email dispatch if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'inquiry@ggetapp.com',
            to: process.env.NOTIFICATION_EMAIL || 'giantgreenecotech@ggetapp.com',
            subject: `[GiantGreen Inquiry] ${record.name} (${record.referenceId})`,
            text: `Reference ID: ${record.referenceId}\nName: ${record.name}\nEmail: ${record.email}\nDate: ${timestamp}\n\nMessage:\n${record.message}`,
          }),
        });
      } catch (emailErr) {
        console.warn('Optional email notification failed:', emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      referenceId,
      message: 'Your inquiry has been received. Our team will contact you shortly.',
    });
  } catch (err: any) {
    console.error('Error handling /api/contact:', err);
    return res.status(500).json({
      error: 'An internal error occurred while processing your message. Please reach out via WhatsApp or email directly.',
    });
  }
});

/**
 * POST /api/demo-request
 * Handles Demo Kit evaluation requests
 */
app.post('/api/demo-request', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      jobTitle,
      hotelProperty,
      hotelGroup,
      country,
      workEmail,
      phoneWhatsApp,
      roomCount,
      preferredMeetingMethod,
      message,
      privacyConsent,
      honeypot,
    } = req.body;

    // Honeypot check
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(400).json({ error: 'Spam detected' });
    }

    // Privacy consent required
    if (!privacyConsent) {
      return res.status(400).json({ error: 'Privacy policy consent is required.' });
    }

    // Validations
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length < 2) {
      return res.status(400).json({ error: 'Job title is required.' });
    }
    if (!hotelProperty || typeof hotelProperty !== 'string' || hotelProperty.trim().length < 2) {
      return res.status(400).json({ error: 'Hotel/Property name is required.' });
    }
    if (!country || typeof country !== 'string' || country.trim().length < 2) {
      return res.status(400).json({ error: 'Country is required.' });
    }
    if (!workEmail || typeof workEmail !== 'string' || !EMAIL_REGEX.test(workEmail.trim())) {
      return res.status(400).json({ error: 'A valid work email is required.' });
    }
    if (!phoneWhatsApp || typeof phoneWhatsApp !== 'string' || phoneWhatsApp.trim().length < 5) {
      return res.status(400).json({ error: 'Phone/WhatsApp number is required.' });
    }
    if (!preferredMeetingMethod || typeof preferredMeetingMethod !== 'string') {
      return res.status(400).json({ error: 'Please specify a preferred meeting method.' });
    }

    const referenceId = generateReferenceId('DEMO');
    const timestamp = new Date().toISOString();

    const record = {
      referenceId,
      timestamp,
      fullName: fullName.trim(),
      jobTitle: jobTitle.trim(),
      hotelProperty: hotelProperty.trim(),
      hotelGroup: hotelGroup ? hotelGroup.trim() : null,
      country: country.trim(),
      workEmail: workEmail.trim().toLowerCase(),
      phoneWhatsApp: phoneWhatsApp.trim(),
      roomCount: roomCount ? roomCount.trim() : null,
      preferredMeetingMethod: preferredMeetingMethod.trim(),
      message: message ? message.trim() : null,
      privacyConsent: true,
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    };

    // Save record to local JSON storage
    try {
      const data = JSON.parse(fs.readFileSync(DEMO_REQUESTS_FILE, 'utf8'));
      data.push(record);
      fs.writeFileSync(DEMO_REQUESTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (saveErr) {
      console.error('Failed to append to demo_requests.json:', saveErr);
    }

    // Optional email dispatch if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'demo-request@ggetapp.com',
            to: process.env.NOTIFICATION_EMAIL || 'giantgreenecotech@ggetapp.com',
            subject: `[Demo Kit Request] ${record.hotelProperty} - ${record.fullName} (${record.referenceId})`,
            text: `Reference ID: ${record.referenceId}\nProperty: ${record.hotelProperty} (${record.country})\nContact: ${record.fullName} - ${record.jobTitle}\nEmail: ${record.workEmail}\nPhone: ${record.phoneWhatsApp}\nRooms: ${record.roomCount || 'N/A'}\nPreferred Meeting: ${record.preferredMeetingMethod}\n\nNotes:\n${record.message || 'None'}\nDate: ${timestamp}`,
          }),
        });
      } catch (emailErr) {
        console.warn('Optional email notification failed:', emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      referenceId,
      message: 'Demo Kit request received successfully.',
    });
  } catch (err: any) {
    console.error('Error handling /api/demo-request:', err);
    return res.status(500).json({
      error: 'An internal error occurred while processing your request. Please reach out via WhatsApp or email directly.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'GiantGreen EcoTech API',
    time: new Date().toISOString(),
  });
});

// Set up dev / prod static & Vite handling
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
    console.log(`GiantGreen EcoTech server running on http://0.0.0.0:${PORT} (Mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
