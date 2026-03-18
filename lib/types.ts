// Simplified schema types for conference management system

export type RegistrationCategory = 'speaker' | 'attendee' | 'paper_presenter' | 'admin' | 'organizer';

export interface User {
  user_id: string;
  email_id: string;
  name: string;
  phone?: string;
  gender?: string;
  organization?: string;
  country?: string;
  registration_category: RegistrationCategory;
  password_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface Conference {
  conference_id: string;
  name: string;
  description?: string;
  date: string;
  venue: string;
  registration_deadline?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ConferenceRegistration {
  registration_id: string;
  user_id: string;
  conference_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Paper {
  paper_id: string;
  user_id: string;
  conference_id: string;
  paper_title: string;
  paper_pages: number;
  created_at: string;
  updated_at: string;
}

export interface TravelForm {
  travel_id: string;
  user_id: string;
  conference_id: string;
  travel_plan: string;
  coming_from_which_state: string;
  return_to_which_state: string;
  arrival_date: string;
  arrival_time?: string;
  departure_date: string;
  departure_time?: string;
  train_no?: string;
  flight_no?: string;
  status: 'pending' | 'submitted' | 'approved';
  created_at: string;
  updated_at: string;
}

export interface AccommodationForm {
  accommodation_id: string;
  user_id: string;
  conference_id: string;
  hostel_needed: boolean;
  hotel_info?: Record<string, unknown>;
  food_pref?: string;
  created_at: string;
  updated_at: string;
}

// Combined interfaces for convenience
export interface UserWithPapers extends User {
  papers?: Paper[];
}

export interface UserWithTravelForm extends User {
  travel_form?: TravelForm;
}

export interface UserWithAccommodation extends User {
  accommodation_form?: AccommodationForm;
}
