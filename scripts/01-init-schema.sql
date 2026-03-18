-- Conference & Event Management System - Database Schema
-- Created for Neon PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'organizer', 'speaker', 'attendee')),
  organization VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Conferences table
CREATE TABLE conferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
CREATE TABLE event_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'modifications_requested')),
  feedback TEXT,
  approval_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_approvals_conference ON event_approvals(conference_id);
CREATE INDEX idx_event_approvals_admin ON event_approvals(admin_id);
CREATE INDEX idx_event_approvals_status ON event_approvals(status);

-- Speakers table
CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
CREATE TABLE speaker_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  speaker_id UUID NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'modifications_requested')),
  feedback TEXT,
  approval_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_speaker_approvals_speaker ON speaker_approvals(speaker_id);
CREATE INDEX idx_speaker_approvals_status ON speaker_approvals(status);

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  floor_number INT,
  equipment TEXT[], -- Array of equipment like "projector", "microphone", "whiteboard"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rooms_conference ON rooms(conference_id);

-- Room Booking Requests table
CREATE TABLE room_booking_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Goodies Inventory table
CREATE TABLE goodies_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE goodies_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Accommodations table
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Attendee Registrations table
CREATE TABLE attendee_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  attendee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- QR Passes table
CREATE TABLE qr_passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pass_code VARCHAR(100) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Queries/Questions table
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conference_id UUID NOT NULL REFERENCES conferences(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
CREATE TABLE query_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_id UUID NOT NULL REFERENCES queries(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_query_responses_query ON query_responses(query_id);

-- Travel Requests table
CREATE TABLE travel_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Activity Log table (for audit trail)
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- CSV Exports Log table
CREATE TABLE csv_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conference_id UUID REFERENCES conferences(id) ON DELETE SET NULL,
  export_type VARCHAR(100) NOT NULL CHECK (export_type IN ('attendees', 'speakers', 'event_report', 'accommodation', 'travel', 'goodies')),
  file_name VARCHAR(255),
  export_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_csv_exports_user ON csv_exports(user_id);
CREATE INDEX idx_csv_exports_conference ON csv_exports(conference_id);
