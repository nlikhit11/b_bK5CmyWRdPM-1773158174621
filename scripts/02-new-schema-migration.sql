-- Migration Script: New Simplified Schema
-- Created: 2026-03-06
-- Purpose: Implement the new simplified database schema with users, papers, travel_form, and accommodation_form tables

-- Drop existing tables if they exist (be careful with this in production!)
-- We'll create new tables with the simplified structure

-- Create users table (restructured)
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  gender VARCHAR(50),
  organization VARCHAR(255),
  country VARCHAR(100),
  registration_category VARCHAR(100) NOT NULL, -- attendee, paper-presenter, speaker, organizer, admin
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email_id);
CREATE INDEX IF NOT EXISTS idx_users_registration_category ON users(registration_category);

-- Create papers table
CREATE TABLE IF NOT EXISTS papers (
  paper_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  paper_title VARCHAR(500) NOT NULL,
  paper_pages INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for papers table
CREATE INDEX IF NOT EXISTS idx_papers_user_id ON papers(user_id);
CREATE INDEX IF NOT EXISTS idx_papers_created_at ON papers(created_at);

-- Create travel_form table
CREATE TABLE IF NOT EXISTS travel_form (
  travel_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  travel_plan VARCHAR(100) NOT NULL, -- cab, car, flight, train
  coming_from_which_state VARCHAR(100) NOT NULL,
  return_to_which_state VARCHAR(100) NOT NULL,
  arrival_date DATE NOT NULL,
  arrival_time TIME,
  departure_date DATE NOT NULL,
  departure_time TIME,
  train_no VARCHAR(50), -- nullable, used only if travel_plan is 'train'
  flight_no VARCHAR(50), -- nullable, used only if travel_plan is 'flight'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for travel_form table
CREATE INDEX IF NOT EXISTS idx_travel_form_user_id ON travel_form(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_form_arrival_date ON travel_form(arrival_date);

-- Create accommodation_form table
CREATE TABLE IF NOT EXISTS accommodation_form (
  accommodation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  hostel_needed BOOLEAN NOT NULL DEFAULT FALSE,
  hotel_info JSONB, -- stores hotel information as JSON object
  food_pref TEXT, -- food preferences as text
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for accommodation_form table
CREATE INDEX IF NOT EXISTS idx_accommodation_form_user_id ON accommodation_form(user_id);
CREATE INDEX IF NOT EXISTS idx_accommodation_form_hostel_needed ON accommodation_form(hostel_needed);

-- Add RLS (Row Level Security) policies if using Supabase
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_form ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_form ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- RLS Policies for papers table
CREATE POLICY "Users can view their own papers" ON papers
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own papers" ON papers
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own papers" ON papers
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own papers" ON papers
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- RLS Policies for travel_form table
CREATE POLICY "Users can view their own travel form" ON travel_form
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own travel form" ON travel_form
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own travel form" ON travel_form
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own travel form" ON travel_form
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- RLS Policies for accommodation_form table
CREATE POLICY "Users can view their own accommodation form" ON accommodation_form
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own accommodation form" ON accommodation_form
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own accommodation form" ON accommodation_form
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own accommodation form" ON accommodation_form
  FOR DELETE USING (auth.uid()::text = user_id::text);
