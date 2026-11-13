export type InquiryType = 'contact' | 'demo';

export type InquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Spam';

export type EmailNotificationStatus = 'pending' | 'sent' | 'failed' | 'unconfigured';

export const INQUIRY_STATUSES: InquiryStatus[] = [
  'New',
  'Contacted',
  'In Progress',
  'Completed',
  'Spam',
];

export interface InquiryRecord {
  id: string;
  reference_id: string;
  inquiry_type: InquiryType;
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
  status: InquiryStatus;
  admin_notes: string | null;
  email_notification_status: EmailNotificationStatus;
  email_notification_error: string | null;
  email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InquiryStats {
  total: number;
  newCount: number;
  contactedCount: number;
  inProgressCount: number;
  completedCount: number;
  spamCount: number;
  demoCount: number;
  contactCount: number;
}
