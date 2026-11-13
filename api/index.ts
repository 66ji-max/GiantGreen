import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import 'dotenv/config';

const app = express();

// Trust reverse proxy headers (Vercel / Cloud Run / Nginx) for accurate IP rate limiting
app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));

// =============================================================================
// Supabase Server Client Setup (Service Role Key - Server Only)
// =============================================================================
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

const isSupabaseConfigured = Boolean(
  SUPABASE_URL.startsWith('http') && SUPABASE_SERVICE_ROLE_KEY.length > 20
);

const supabaseAdmin: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// =============================================================================
// Email Notification Config (Resend - Server Only)
// =============================================================================
const NOTIFICATION_EMAIL = (process.env.NOTIFICATION_EMAIL || 'giantgreenecotech@ggetapp.com').trim();
const EMAIL_FROM = (process.env.EMAIL_FROM || 'GiantGreen EcoTech <onboarding@resend.dev>').trim();

// =============================================================================
// Serverless-Safe Rate Limiting & Duplicate Protection
// =============================================================================
interface RateLimitEntry {
  timestamps: number[];
}

const publicRateLimitMap = new Map<string, RateLimitEntry>();
const adminRateLimitMap = new Map<string, RateLimitEntry>();
const recentSubmissionHashes = new Map<string, number>();
let lastCleanupAt = Date.now();

function cleanupRateLimitStores() {
  const now = Date.now();
  if (now - lastCleanupAt < 5 * 60 * 1000) return;
  lastCleanupAt = now;

  for (const [key, entry] of publicRateLimitMap.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 15 * 60 * 1000);
    if (entry.timestamps.length === 0) publicRateLimitMap.delete(key);
  }
  for (const [key, entry] of adminRateLimitMap.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < 60 * 1000);
    if (entry.timestamps.length === 0) adminRateLimitMap.delete(key);
  }
  for (const [hash, ts] of recentSubmissionHashes.entries()) {
    if (now - ts > 60 * 1000) recentSubmissionHashes.delete(hash);
  }
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

function createRateLimiter(
  store: Map<string, RateLimitEntry>,
  maxRequests: number,
  windowMs: number,
  message: string
) {
  return (req: Request, res: Response, next: NextFunction) => {
    cleanupRateLimitStores();
    const ip = getClientIp(req);
    const now = Date.now();
    const entry = store.get(ip) || { timestamps: [] };
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

    if (entry.timestamps.length >= maxRequests) {
      return res.status(429).json({ error: message });
    }

    entry.timestamps.push(now);
    store.set(ip, entry);
    next();
  };
}

const publicFormLimiter = createRateLimiter(
  publicRateLimitMap,
  5,
  15 * 60 * 1000,
  'Too many submissions from this connection. Please wait a few minutes or reach out via WhatsApp.'
);

const adminApiLimiter = createRateLimiter(
  adminRateLimitMap,
  120,
  60 * 1000,
  'Rate limit exceeded. Please wait a moment before retrying.'
);

// =============================================================================
// Validation Schemas
// =============================================================================
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please provide your full name (at least 2 characters).').max(120),
  email: z.string().trim().email('Please provide a valid email address.').max(180),
  message: z.string().trim().min(5, 'Please provide an inquiry message (at least 5 characters).').max(4000),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Privacy Policy before submitting.',
  }),
  honeypot: z.string().max(0, 'Invalid submission').optional().default(''),
});

const demoRequestSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required (at least 2 characters).').max(120),
  jobTitle: z.string().trim().min(2, 'Job title is required.').max(120),
  hotelProperty: z.string().trim().min(2, 'Hotel/Property name is required.').max(160),
  hotelGroup: z.string().trim().max(160).optional().nullable(),
  country: z.string().trim().min(2, 'Country is required.').max(100),
  workEmail: z.string().trim().email('A valid work email is required.').max(180),
  phoneWhatsApp: z.string().trim().min(5, 'Phone/WhatsApp number is required.').max(40),
  roomCount: z.string().trim().max(60).optional().nullable(),
  preferredMeetingMethod: z.string().trim().min(1, 'Please select a preferred meeting method.').max(100),
  message: z.string().trim().max(4000).optional().nullable(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'Privacy policy consent is required.',
  }),
  honeypot: z.string().max(0, 'Invalid submission').optional().default(''),
});

const adminUpdateSchema = z.object({
  status: z.enum(['New', 'Contacted', 'In Progress', 'Completed', 'Spam']).optional(),
  admin_notes: z.string().max(5000).nullable().optional(),
});

// =============================================================================
// Helper Functions
// =============================================================================
function generateReferenceId(type: 'contact' | 'demo'): string {
  const prefix = type === 'demo' ? 'DEMO' : 'MSG';
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const hexSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `GG-${prefix}-${yearMonth}-${hexSuffix}`;
}

function escapeHtml(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface InquiryRow {
  id: string;
  reference_id: string;
  inquiry_type: 'contact' | 'demo';
  full_name: string;
  email: string;
  phone: string | null;
  company_or_hotel: string | null;
  job_title: string | null;
  country: string | null;
  hotel_group: string | null;
  room_count: string | null;
  preferred_meeting_method: string | null;
  message: string | null;
  privacy_consent: boolean;
  privacy_consent_at: string | null;
  status: string;
  admin_notes: string | null;
  email_notification_status: 'pending' | 'sent' | 'failed' | 'unconfigured';
  email_notification_error: string | null;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

async function sendNotificationEmailAndRecord(record: InquiryRow): Promise<{
  status: 'sent' | 'failed' | 'unconfigured';
  error: string | null;
}> {
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();

  if (!resendApiKey) {
    const errorMsg = 'RESEND_API_KEY is not configured on the server.';
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('inquiries')
        .update({
          email_notification_status: 'unconfigured',
          email_notification_error: errorMsg,
        })
        .eq('id', record.id);
    }
    return { status: 'unconfigured', error: errorMsg };
  }

  const isDemo = record.inquiry_type === 'demo';
  const typeLabel = isDemo ? 'Demo Kit Request' : 'Contact Inquiry';
  const subject = isDemo
    ? `[JYANTY Demo Kit] ${record.company_or_hotel || 'Hotel Property'} — ${record.full_name} (${record.reference_id})`
    : `[GiantGreen Contact] ${record.full_name} (${record.reference_id})`;

  const submittedAt = new Date(record.created_at).toUTCString();

  const textBody = [
    `New ${typeLabel} Received`,
    `========================================`,
    `Reference ID:   ${record.reference_id}`,
    `Inquiry Type:   ${typeLabel}`,
    `Submitted At:   ${submittedAt}`,
    ``,
    `Contact Details:`,
    `  Full Name:    ${record.full_name}`,
    `  Work Email:   ${record.email}`,
    `  Phone/WA:     ${record.phone || 'Not provided'}`,
    isDemo ? `  Job Title:    ${record.job_title || 'Not provided'}` : null,
    isDemo ? `  Hotel/Prop:   ${record.company_or_hotel || 'Not provided'}` : null,
    isDemo && record.hotel_group ? `  Hotel Group:  ${record.hotel_group}` : null,
    isDemo ? `  Country:      ${record.country || 'Not provided'}` : null,
    isDemo && record.room_count ? `  Room Count:   ${record.room_count}` : null,
    isDemo ? `  Meeting Pref: ${record.preferred_meeting_method || 'Not specified'}` : null,
    ``,
    `Message / Notes:`,
    `${record.message || 'No additional message provided.'}`,
    ``,
    `Manage this inquiry in the GiantGreen Admin Portal.`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #171512; max-width: 600px; margin: 0 auto; border: 1px solid #D8C6AE; background: #F4EFE6; padding: 24px;">
      <div style="border-bottom: 1px solid #C6A77B; padding-bottom: 12px; margin-bottom: 20px;">
        <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #8B5E3C; margin: 0 0 4px;">GiantGreen EcoTech</p>
        <h2 style="margin: 0; font-size: 22px; color: #2A1C14;">New ${escapeHtml(typeLabel)}</h2>
      </div>
      <div style="background: #FFFFFF; padding: 20px; border: 1px solid #D8C6AE;">
        <p style="margin: 0 0 12px;"><strong>Reference ID:</strong> <code style="background: #F4EFE6; padding: 2px 6px;">${escapeHtml(record.reference_id)}</code></p>
        <p style="margin: 0 0 8px;"><strong>Full Name:</strong> ${escapeHtml(record.full_name)}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(record.email)}</p>
        <p style="margin: 0 0 8px;"><strong>Phone / WhatsApp:</strong> ${escapeHtml(record.phone || 'Not provided')}</p>
        ${
          isDemo
            ? `
          <p style="margin: 0 0 8px;"><strong>Hotel / Property:</strong> ${escapeHtml(record.company_or_hotel)}</p>
          <p style="margin: 0 0 8px;"><strong>Job Title:</strong> ${escapeHtml(record.job_title)}</p>
          <p style="margin: 0 0 8px;"><strong>Country:</strong> ${escapeHtml(record.country)}</p>
          <p style="margin: 0 0 8px;"><strong>Hotel Group:</strong> ${escapeHtml(record.hotel_group || 'N/A')}</p>
          <p style="margin: 0 0 8px;"><strong>Room Count:</strong> ${escapeHtml(record.room_count || 'N/A')}</p>
          <p style="margin: 0 0 8px;"><strong>Preferred Meeting:</strong> ${escapeHtml(record.preferred_meeting_method)}</p>
        `
            : ''
        }
        <p style="margin: 0 0 8px;"><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #F4EFE6;">
          <p style="margin: 0 0 6px;"><strong>Message:</strong></p>
          <p style="margin: 0; white-space: pre-wrap; color: #2A1C14;">${escapeHtml(record.message || 'No additional message provided.')}</p>
        </div>
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [NOTIFICATION_EMAIL],
        reply_to: record.email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      const errorMsg = `Resend API error (${response.status}): ${errBody.slice(0, 300)}`;
      console.error('Failed to send notification email:', errorMsg);
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('inquiries')
          .update({
            email_notification_status: 'failed',
            email_notification_error: errorMsg,
          })
          .eq('id', record.id);
      }
      return { status: 'failed', error: errorMsg };
    }

    if (supabaseAdmin) {
      await supabaseAdmin
        .from('inquiries')
        .update({
          email_notification_status: 'sent',
          email_notification_error: null,
          email_sent_at: new Date().toISOString(),
        })
        .eq('id', record.id);
    }

    return { status: 'sent', error: null };
  } catch (err: any) {
    const errorMsg = err?.message || 'Network error while dispatching email notification';
    console.error('Exception sending notification email:', errorMsg);
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('inquiries')
        .update({
          email_notification_status: 'failed',
          email_notification_error: errorMsg,
        })
        .eq('id', record.id);
    }
    return { status: 'failed', error: errorMsg };
  }
}

async function insertInquiryWithUniqueRef(
  payload: Omit<
    InquiryRow,
    | 'id'
    | 'reference_id'
    | 'status'
    | 'admin_notes'
    | 'email_notification_status'
    | 'email_notification_error'
    | 'email_sent_at'
    | 'created_at'
    | 'updated_at'
  >
): Promise<InquiryRow> {
  if (!supabaseAdmin) {
    throw new Error('DATABASE_UNCONFIGURED');
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const referenceId = generateReferenceId(payload.inquiry_type);
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        ...payload,
        reference_id: referenceId,
        status: 'New',
        email_notification_status: 'pending',
      })
      .select()
      .single();

    if (!error && data) {
      return data as InquiryRow;
    }

    if (error && error.code === '23505') {
      continue;
    }

    throw new Error(error?.message || 'Failed to save inquiry to database.');
  }

  throw new Error('Could not generate a unique reference ID after retries.');
}

// =============================================================================
// Admin Authentication & Authorization Middleware
// =============================================================================
interface AuthenticatedRequest extends Request {
  adminUser?: {
    id: string;
    email: string;
    role: string;
  };
}

function isAuthorizedAdminUser(user: { email?: string; app_metadata?: Record<string, any> }): boolean {
  const email = (user.email || '').trim().toLowerCase();
  const allowedEmailsRaw = (process.env.ADMIN_ALLOWED_EMAILS || '').trim();

  if (allowedEmailsRaw.length > 0) {
    const allowedList = allowedEmailsRaw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return allowedList.includes(email);
  }

  if (user.app_metadata?.role === 'admin') {
    return true;
  }

  if (email === 'giantgreenecotech@ggetapp.com') {
    return true;
  }

  return false;
}

async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!supabaseAdmin) {
    return res.status(503).json({
      error: 'Supabase backend is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
      code: 'DATABASE_UNCONFIGURED',
    });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    }

    if (!isAuthorizedAdminUser(data.user)) {
      return res.status(403).json({
        error: 'Access denied. This account is not authorized as a GiantGreen EcoTech administrator.',
      });
    }

    req.adminUser = {
      id: data.user.id,
      email: data.user.email || '',
      role: data.user.app_metadata?.role || 'admin',
    };
    next();
  } catch (err) {
    console.error('Admin token verification error:', err);
    return res.status(401).json({ error: 'Authentication verification failed.' });
  }
}

// =============================================================================
// Public API Endpoints
// =============================================================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'GiantGreen EcoTech API',
    runtime: process.env.VERCEL ? 'vercel-serverless' : 'node-server',
    databaseConfigured: isSupabaseConfigured,
    emailConfigured: Boolean((process.env.RESEND_API_KEY || '').trim()),
    time: new Date().toISOString(),
  });
});

app.post('/api/contact', publicFormLimiter, async (req: Request, res: Response) => {
  if (!isSupabaseConfigured) {
    return res.status(503).json({
      error:
        'Our online inquiry database is currently awaiting configuration. Please reach us directly via WhatsApp (+60 123629153) or email (giantgreenecotech@ggetapp.com).',
      code: 'DATABASE_UNCONFIGURED',
    });
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Invalid form input.';
    return res.status(400).json({ error: firstIssue });
  }

  const { name, email, message, honeypot } = parsed.data;
  if (honeypot && honeypot.length > 0) {
    return res.status(400).json({ error: 'Invalid submission detected.' });
  }

  const dedupeKey = crypto
    .createHash('sha256')
    .update(`contact:${email.toLowerCase()}:${message}`)
    .digest('hex');
  const lastTime = recentSubmissionHashes.get(dedupeKey);
  if (lastTime && Date.now() - lastTime < 60 * 1000) {
    return res.status(429).json({
      error: 'This message was already submitted moments ago. Please wait before submitting again.',
    });
  }

  try {
    const savedRecord = await insertInquiryWithUniqueRef({
      inquiry_type: 'contact',
      full_name: name,
      email: email.toLowerCase(),
      phone: null,
      company_or_hotel: null,
      job_title: null,
      country: null,
      hotel_group: null,
      room_count: null,
      preferred_meeting_method: null,
      message,
      privacy_consent: true,
      privacy_consent_at: new Date().toISOString(),
    });

    recentSubmissionHashes.set(dedupeKey, Date.now());

    const emailResult = await sendNotificationEmailAndRecord(savedRecord);

    return res.status(201).json({
      success: true,
      referenceId: savedRecord.reference_id,
      emailNotificationStatus: emailResult.status,
      message: 'Your inquiry has been saved. Our hospitality team will respond shortly.',
    });
  } catch (err: any) {
    console.error('Error saving contact inquiry:', err);
    return res.status(500).json({
      error:
        'Unable to store your inquiry in the database at this moment. Please reach out directly via WhatsApp or email.',
    });
  }
});

app.post('/api/demo-request', publicFormLimiter, async (req: Request, res: Response) => {
  if (!isSupabaseConfigured) {
    return res.status(503).json({
      error:
        'Our Demo Kit request database is currently awaiting configuration. Please reach us directly via WhatsApp (+60 123629153) or email (giantgreenecotech@ggetapp.com).',
      code: 'DATABASE_UNCONFIGURED',
    });
  }

  const parsed = demoRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Invalid form input.';
    return res.status(400).json({ error: firstIssue });
  }

  const data = parsed.data;
  if (data.honeypot && data.honeypot.length > 0) {
    return res.status(400).json({ error: 'Invalid submission detected.' });
  }

  const dedupeKey = crypto
    .createHash('sha256')
    .update(`demo:${data.workEmail.toLowerCase()}:${data.hotelProperty.toLowerCase()}`)
    .digest('hex');
  const lastTime = recentSubmissionHashes.get(dedupeKey);
  if (lastTime && Date.now() - lastTime < 60 * 1000) {
    return res.status(429).json({
      error: 'A Demo Kit request for this property was already submitted moments ago.',
    });
  }

  try {
    const savedRecord = await insertInquiryWithUniqueRef({
      inquiry_type: 'demo',
      full_name: data.fullName,
      email: data.workEmail.toLowerCase(),
      phone: data.phoneWhatsApp,
      company_or_hotel: data.hotelProperty,
      job_title: data.jobTitle,
      country: data.country,
      hotel_group: data.hotelGroup || null,
      room_count: data.roomCount || null,
      preferred_meeting_method: data.preferredMeetingMethod,
      message: data.message || null,
      privacy_consent: true,
      privacy_consent_at: new Date().toISOString(),
    });

    recentSubmissionHashes.set(dedupeKey, Date.now());

    const emailResult = await sendNotificationEmailAndRecord(savedRecord);

    return res.status(201).json({
      success: true,
      referenceId: savedRecord.reference_id,
      emailNotificationStatus: emailResult.status,
      message: 'Your Demo Kit request has been saved and logged.',
    });
  } catch (err: any) {
    console.error('Error saving demo request:', err);
    return res.status(500).json({
      error:
        'Unable to save your Demo Kit request to the database. Please reach out via WhatsApp or email directly.',
    });
  }
});

// =============================================================================
// Protected Admin API Endpoints
// =============================================================================
app.get('/api/admin/me', adminApiLimiter, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.adminUser });
});

app.get('/api/admin/inquiries', adminApiLimiter, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Database unconfigured' });
  }

  try {
    const typeFilter = typeof req.query.type === 'string' ? req.query.type : 'all';
    const statusFilter = typeof req.query.status === 'string' ? req.query.status : 'all';
    const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
    const dateFrom = typeof req.query.dateFrom === 'string' ? req.query.dateFrom.trim() : '';
    const dateTo = typeof req.query.dateTo === 'string' ? req.query.dateTo.trim() : '';

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const allRows = (data || []) as InquiryRow[];

    const stats = {
      total: allRows.length,
      newCount: allRows.filter((r) => r.status === 'New').length,
      contactedCount: allRows.filter((r) => r.status === 'Contacted').length,
      inProgressCount: allRows.filter((r) => r.status === 'In Progress').length,
      completedCount: allRows.filter((r) => r.status === 'Completed').length,
      spamCount: allRows.filter((r) => r.status === 'Spam').length,
      demoCount: allRows.filter((r) => r.inquiry_type === 'demo').length,
      contactCount: allRows.filter((r) => r.inquiry_type === 'contact').length,
    };

    const filtered = allRows.filter((row) => {
      if (typeFilter !== 'all' && row.inquiry_type !== typeFilter) return false;
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;

      if (dateFrom) {
        const rowDate = row.created_at.slice(0, 10);
        if (rowDate < dateFrom) return false;
      }
      if (dateTo) {
        const rowDate = row.created_at.slice(0, 10);
        if (rowDate > dateTo) return false;
      }

      if (search) {
        const haystack = [
          row.reference_id,
          row.full_name,
          row.email,
          row.company_or_hotel || '',
          row.country || '',
          row.hotel_group || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      return true;
    });

    res.json({ inquiries: filtered, stats });
  } catch (err: any) {
    console.error('Error fetching admin inquiries:', err);
    res.status(500).json({ error: 'Failed to retrieve inquiries from database.' });
  }
});

app.patch('/api/admin/inquiries/:id', adminApiLimiter, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Database unconfigured' });
  }

  const { id } = req.params;
  const uuidCheck = z.string().uuid().safeParse(id);
  if (!uuidCheck.success) {
    return res.status(400).json({ error: 'Invalid inquiry ID format.' });
  }

  const parsed = adminUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid update payload.' });
  }

  const updates: Record<string, any> = {};
  if (parsed.data.status !== undefined) {
    updates.status = parsed.data.status;
  }
  if (parsed.data.admin_notes !== undefined) {
    updates.admin_notes = parsed.data.admin_notes;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields provided to update.' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.json({ inquiry: data });
  } catch (err: any) {
    console.error('Error updating inquiry:', err);
    res.status(500).json({ error: 'Failed to update inquiry.' });
  }
});

app.post(
  '/api/admin/inquiries/:id/retry-email',
  adminApiLimiter,
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    if (!supabaseAdmin) {
      return res.status(503).json({ error: 'Database unconfigured' });
    }

    const { id } = req.params;
    const uuidCheck = z.string().uuid().safeParse(id);
    if (!uuidCheck.success) {
      return res.status(400).json({ error: 'Invalid inquiry ID format.' });
    }

    try {
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existing) {
        return res.status(404).json({ error: 'Inquiry record not found.' });
      }

      const result = await sendNotificationEmailAndRecord(existing as InquiryRow);

      const { data: refreshed } = await supabaseAdmin
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();

      res.json({
        success: result.status === 'sent',
        emailStatus: result.status,
        error: result.error,
        inquiry: refreshed || existing,
      });
    } catch (err: any) {
      console.error('Error retrying email notification:', err);
      res.status(500).json({ error: 'Failed to retry email notification.' });
    }
  }
);

// Catch-all JSON 404 for unknown /api/* routes so API requests never fall back to HTML
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

export default app;
