-- Conference & Event Management System - Complete Unified Schema
-- Combines all original tables with new simplified user/paper/travel/accommodation tables
-- Created for Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE USER MANAGEMENT TABLES (NEW SIMPLIFIED SCHEMA)
-- ============================================================================

-- Users table (restructured with registration_category)
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  gender VARCHAR(50),
  organization VARCHAR(255),
  country VARCHAR(100),
  registration_category VARCHAR(100) NOT NULL CHECK (registration_category IN ('attendee', 'paper_presenter', 'speaker', 'organizer', 'admin')),
  password_hash VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email_id);
CREATE INDEX idx_users_registration_category ON users(registration_category);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================================================
-- PAPER SUBMISSION TABLES (NEW)
-- ============================================================================

CREATE TABLE IF NOT EXISTS papers (
  paper_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  paper_title VARCHAR(500) NOT NULL,
  paper_pages INT NOT NULL,
  status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_papers_user_id ON papers(user_id);
CREATE INDEX idx_papers_created_at ON papers(created_at);
CREATE INDEX idx_papers_status ON papers(status);

-- ============================================================================
-- TRAVEL FORMS TABLE (NEW)
-- ============================================================================

CREATE TABLE IF NOT EXISTS travel_form (
  travel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  travel_plan VARCHAR(100) NOT NULL CHECK (travel_plan IN ('cab', 'car', 'flight', 'train', 'bus')),
  coming_from_which_state VARCHAR(100) NOT NULL,
  return_to_which_state VARCHAR(100) NOT NULL,
  arrival_date DATE NOT NULL,
  arrival_time TIME,
  departure_date DATE NOT NULL,
  departure_time TIME,
  train_no VARCHAR(50),
  flight_no VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_travel_form_user_id ON travel_form(user_id);
CREATE INDEX idx_travel_form_arrival_date ON travel_form(arrival_date);
CREATE INDEX idx_travel_form_status ON travel_form(status);

-- ============================================================================
-- ACCOMMODATION FORMS TABLE (NEW)
-- ============================================================================

CREATE TABLE IF NOT EXISTS accommodation_form (
  accommodation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  hostel_needed BOOLEAN NOT NULL DEFAULT FALSE,
  hotel_info JSONB,
  food_pref TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'assigned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accommodation_form_user_id ON accommodation_form(user_id);
CREATE INDEX idx_accommodation_form_hostel_needed ON accommodation_form(hostel_needed);
CREATE INDEX idx_accommodation_form_status ON accommodation_form(status);

-- ============================================================================
-- CONFERENCE MANAGEMENT TABLES (ORIGINAL)
-- ============================================================================

-- Conferences table
CREATE TABLE IF NOT EXISTS conferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  organizer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'ongoing', 'completed', 'cancelled')),
  expected_attendees INT DEFAULT 0,
  budget DECIMAL(12, 2),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conferences_organizer ON conferences(organizer_id);
CREATE INDEX idx_conferences_status ON conferences(status);
CREATE INDEX idx_conferences_start_date ON conferences(start_date);

-- Event Approvals table
CREATE TABLE IF NOT EXISTS event_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'modifications_requested')),
  feedback TEXT,
  approval_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_approvals_conference ON event_approvals(conference_id);
CREATE INDEX idx_event_approvals_admin ON event_approvals(admin_id);
CREATE INDEX idx_event_approvals_status ON event_approvals(status);

-- ============================================================================
-- SPEAKER MANAGEMENT TABLES (ORIGINAL)
-- ============================================================================

-- Speakers table
CREATE TABLE IF NOT EXISTS speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  topic VARCHAR(255),
  bio TEXT,
  expertise_area VARCHAR(255),
  invitation_status VARCHAR(50) DEFAULT 'pending' CHECK (invitation_status IN ('pending', 'invited', 'accepted', 'rejected', 'withdrawn')),
  acceptance_date TIMESTAMP,
  travel_required BOOLEAN DEFAULT false,
  accommodation_required BOOLEAN DEFAULT false,
  presentation_date TIMESTAMP,
  presentation_time VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_speakers_conference ON speakers(conference_id);
CREATE INDEX idx_speakers_user ON speakers(user_id);
CREATE INDEX idx_speakers_status ON speakers(invitation_status);

-- Speaker Approvals table
CREATE TABLE IF NOT EXISTS speaker_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  speaker_id UUID NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'modifications_requested')),
  feedback TEXT,
  approval_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_speaker_approvals_speaker ON speaker_approvals(speaker_id);
CREATE INDEX idx_speaker_approvals_status ON speaker_approvals(status);

-- ============================================================================
-- ROOM MANAGEMENT TABLES (ORIGINAL)
-- ============================================================================

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  floor_number INT,
  equipment TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rooms_conference ON rooms(conference_id);

-- Room Booking Requests table
CREATE TABLE IF NOT EXISTS room_booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  requested_capacity INT NOT NULL,
  expected_attendees INT,
  booking_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'alternative_suggested')),
  admin_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_room_bookings_conference ON room_booking_requests(conference_id);
CREATE INDEX idx_room_bookings_organizer ON room_booking_requests(organizer_id);
CREATE INDEX idx_room_bookings_status ON room_booking_requests(status);

-- ============================================================================
-- GOODIES MANAGEMENT TABLES (ORIGINAL)
-- ============================================================================

-- Goodies Inventory table
CREATE TABLE IF NOT EXISTS goodies_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  total_stock INT DEFAULT 0,
  available_stock INT DEFAULT 0,
  cost_per_unit DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goodies_inventory_conference ON goodies_inventory(conference_id);

-- Goodies Requests table
CREATE TABLE IF NOT EXISTS goodies_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  requested_quantity INT NOT NULL,
  approved_quantity INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'partially_approved')),
  admin_feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goodies_requests_conference ON goodies_requests(conference_id);
CREATE INDEX idx_goodies_requests_organizer ON goodies_requests(organizer_id);
CREATE INDEX idx_goodies_requests_status ON goodies_requests(status);

-- ============================================================================
-- ATTENDEE MANAGEMENT TABLES (ORIGINAL)
-- ============================================================================

-- Attendee Registrations table
CREATE TABLE IF NOT EXISTS attendee_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  registration_status VARCHAR(50) DEFAULT 'registered' CHECK (registration_status IN ('registered', 'checked_in', 'no_show', 'cancelled')),
  phone VARCHAR(20),
  organization VARCHAR(255),
  accommodation_required BOOLEAN DEFAULT false,
  dietary_restrictions TEXT,
  special_requirements TEXT,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  checked_in_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attendee_registrations_conference ON attendee_registrations(conference_id);
CREATE INDEX idx_attendee_registrations_attendee ON attendee_registrations(attendee_id);
CREATE INDEX idx_attendee_registrations_status ON attendee_registrations(registration_status);

-- ============================================================================
-- ACCOMMODATION MANAGEMENT TABLES (ORIGINAL)
-- ============================================================================

-- Accommodations table (for assignment/booking by organizers)
CREATE TABLE IF NOT EXISTS accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  guest_type VARCHAR(50) NOT NULL CHECK (guest_type IN ('speaker', 'attendee')),
  hotel_name VARCHAR(255),
  hotel_address TEXT,
  room_number VARCHAR(50),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'confirmed', 'checked_in', 'checked_out')),
  special_requirements TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accommodations_conference ON accommodations(conference_id);
CREATE INDEX idx_accommodations_guest ON accommodations(guest_id);
CREATE INDEX idx_accommodations_status ON accommodations(status);

-- ============================================================================
-- QR PASS & ATTENDANCE TABLES (ORIGINAL)
-- ============================================================================

-- QR Passes table
CREATE TABLE IF NOT EXISTS qr_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_code VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  pass_type VARCHAR(50) NOT NULL CHECK (pass_type IN ('speaker', 'attendee', 'organizer', 'admin')),
  qr_data TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_qr_passes_user ON qr_passes(user_id);
CREATE INDEX idx_qr_passes_conference ON qr_passes(conference_id);
CREATE INDEX idx_qr_passes_pass_code ON qr_passes(pass_code);

-- ============================================================================
-- COMMUNICATION TABLES (ORIGINAL)
-- ============================================================================

-- Queries/Questions table
CREATE TABLE IF NOT EXISTS queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_queries_conference ON queries(conference_id);
CREATE INDEX idx_queries_user ON queries(user_id);
CREATE INDEX idx_queries_status ON queries(status);

-- Query Responses table
CREATE TABLE IF NOT EXISTS query_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID NOT NULL REFERENCES queries(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_query_responses_query ON query_responses(query_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('approval', 'invitation', 'registration', 'reminder', 'alert', 'system')),
  related_conference_id UUID REFERENCES conferences(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================================================
-- TRAVEL REQUESTS TABLE (ORIGINAL - alternative to new travel_form)
-- ============================================================================

-- Travel Requests table (for organizer-assigned travel)
CREATE TABLE IF NOT EXISTS travel_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  speaker_id UUID NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  travel_date DATE NOT NULL,
  travel_type VARCHAR(50) CHECK (travel_type IN ('flight', 'train', 'cab', 'bus')),
  pickup_time TIME,
  contact_number VARCHAR(20),
  special_requirements TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'booked', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_travel_requests_speaker ON travel_requests(speaker_id);
CREATE INDEX idx_travel_requests_conference ON travel_requests(conference_id);

-- ============================================================================
-- AUDIT & LOGGING TABLES (ORIGINAL)
-- ============================================================================

-- Activity Log table (for audit trail)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- CSV Exports Log table
CREATE TABLE IF NOT EXISTS csv_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  conference_id UUID REFERENCES conferences(id) ON DELETE SET NULL,
  export_type VARCHAR(100) NOT NULL CHECK (export_type IN ('attendees', 'speakers', 'event_report', 'accommodation', 'travel', 'goodies')),
  file_name VARCHAR(255),
  export_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_csv_exports_user ON csv_exports(user_id);
CREATE INDEX idx_csv_exports_conference ON csv_exports(conference_id);
