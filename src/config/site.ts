/**
 * GiantGreen EcoTech - Centralized Site Configuration
 * All contact information, links, and prefilled messages are managed here.
 */

export const siteConfig = {
  name: 'GiantGreen EcoTech',
  legalName: 'GiantGreen EcoTech L.L.C.',
  tagline: 'Elevating the smallest details of the luxury hotel stay.',
  description:
    'GiantGreen EcoTech provides focused guest-room amenity solutions for luxury hotels, reducing single-use plastic and elevating guest perceived quality.',
  headquarters: 'United States',
  marketOperations: 'Malaysia (UTC+8)',
  founder: 'Joseph Lee',

  contact: {
    // Primary official phone number (Malaysia operations)
    phoneDisplay: '+60 123629153',
    phoneRaw: '60123629153',
    phoneTel: 'tel:+60123629153',
    
    // Official business email
    email: 'giantgreenecotech@ggetapp.com',
    emailMailto: 'mailto:giantgreenecotech@ggetapp.com',

    // Primary WhatsApp base URL
    whatsappBase: 'https://wa.me/60123629153',
  },

  // Booking / Schedule configuration
  booking: {
    // Resolved booking URL (checks env var, verifies it's an actual booking appointment link)
    getUrl: (): string | null => {
      const url = import.meta.env.VITE_GOOGLE_BOOKING_URL;
      if (!url || typeof url !== 'string') return null;
      const trimmed = url.trim();
      // If it's a generic Google Calendar home page or empty, don't use it
      if (
        trimmed === '' ||
        trimmed === '#' ||
        trimmed === 'https://calendar.google.com/' ||
        trimmed === 'https://calendar.google.com'
      ) {
        return null;
      }
      return trimmed;
    },
  },
};

/**
 * Generate a WhatsApp chat URL with an appropriate prefilled message.
 */
export function getWhatsAppLink(message?: string): string {
  const defaultMsg =
    'Hello GiantGreen EcoTech, I would like to inquire about your hotel amenity solutions.';
  const msg = message || defaultMsg;
  return `https://wa.me/${siteConfig.contact.phoneRaw}?text=${encodeURIComponent(msg)}`;
}

/**
 * Preset WhatsApp messages for specific pages and user intents.
 */
export const WHATSAPP_PRESETS = {
  default:
    'Hello GiantGreen EcoTech, I would like to inquire about your hotel amenity solutions.',
  homeHero:
    'Hello GiantGreen EcoTech, I would like to learn more about a JYANTY pilot for our hotel.',
  homePilot:
    'Hello GiantGreen EcoTech, we are interested in discussing a controlled pilot for our property.',
  demoRequest:
    'Hello GiantGreen EcoTech, I would like to inquire about requesting a JYANTY Demo Kit for our property.',
  demoFollowUp: (referenceId: string) =>
    `Hello GiantGreen EcoTech, I have submitted a Demo Kit request with reference ID: ${referenceId}. I would like to discuss the next steps.`,
  contact:
    'Hello GiantGreen EcoTech, I would like to discuss hospitality amenity solutions for our hotel.',
  booking:
    'Hello GiantGreen EcoTech, I would like to schedule a 15-minute presentation regarding JYANTY.',
};
