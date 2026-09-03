export interface Event {
  id: string;
  slug: string;
  title: string;
  celebrant_name: string;
  event_date: string;
  location_name: string;
  location_details?: string | null;
  google_maps_url?: string | null;
  created_at: string;
}

export interface Guest {
  id: string;
  event_id: string;
  full_name: string;
  whatsapp: string;
  created_at: string;
  updated_at: string;
}

export interface RSVP {
  id: string;
  guest_id: string;
  attending: boolean;
  guest_count: number;
  message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RSVPFormData {
  fullName: string;
  whatsapp: string;
  attending: boolean;
  guestCount: number;
  message: string;
}

export interface RSVPResult {
  success: boolean;
  message: string;
  isUpdate?: boolean;
}
