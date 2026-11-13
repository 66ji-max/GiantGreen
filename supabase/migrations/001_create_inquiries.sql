-- =============================================================================
-- GiantGreen EcoTech - Customer Inquiry Management System Schema
-- Migration: 001_create_inquiries.sql
-- =============================================================================
-- Run this SQL in your Supabase Dashboard -> SQL Editor.

-- Enable pgcrypto for gen_random_uuid() if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create the unified inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT UNIQUE NOT NULL,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('contact', 'demo')),

  -- Contact & Property Details
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_or_hotel TEXT,
  job_title TEXT,
  country TEXT,
  hotel_group TEXT,
  room_count TEXT,
  preferred_meeting_method TEXT,
  message TEXT,

  -- Privacy & Consent Tracking
  privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
  privacy_consent_at TIMESTAMPTZ,

  -- Workflow & Internal Administration
  status TEXT NOT NULL DEFAULT 'New' CHECK (
    status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Spam')
  ),
  admin_notes TEXT,

  -- Email Notification Audit & Retry Tracking
  email_notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    email_notification_status IN ('pending', 'sent', 'failed', 'unconfigured')
  ),
  email_notification_error TEXT,
  email_sent_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Performance Indexes for Admin Filtering & Search
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON public.inquiries (inquiry_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_reference_id ON public.inquiries (reference_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON public.inquiries (email);

-- 3. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER trigger_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_inquiries_updated_at();

-- 4. Row Level Security (RLS) - Least Privilege Enforcement
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke direct public/anon access.
-- All public submissions MUST pass through our validated Express backend API,
-- which uses the server-side SUPABASE_SERVICE_ROLE_KEY after rate limiting & validation.
REVOKE ALL ON TABLE public.inquiries FROM anon;
REVOKE ALL ON TABLE public.inquiries FROM public;

-- Deny all direct access to unauthenticated visitors
DROP POLICY IF EXISTS "Deny anon access to inquiries" ON public.inquiries;
CREATE POLICY "Deny anon access to inquiries"
  ON public.inquiries
  FOR ALL
  TO anon
  USING (FALSE)
  WITH CHECK (FALSE);

-- Restrict direct authenticated access only to users marked with admin role in app_metadata
-- (Note: Our Express admin API also verifies the JWT and ADMIN_ALLOWED_EMAILS on the server.)
DROP POLICY IF EXISTS "Admin read inquiries" ON public.inquiries;
CREATE POLICY "Admin read inquiries"
  ON public.inquiries
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "Admin update inquiries" ON public.inquiries;
CREATE POLICY "Admin update inquiries"
  ON public.inquiries
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
