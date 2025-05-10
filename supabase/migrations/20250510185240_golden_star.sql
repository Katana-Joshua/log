/*
  # Initial Database Schema

  1. New Tables
    - users: Store user profiles and authentication data
    - wallets: Handle user balances and transactions
    - vehicle_types: Define available vehicle types and pricing
    - jobs: Manage delivery jobs and their lifecycle
    - tracking_records: Store real-time location updates
    - payments: Track all financial transactions
    - escrows: Handle payment escrow for jobs
    - ratings: Store user feedback and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Implement role-based access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('client', 'transporter', 'admin', 'finance')),
  is_verified boolean DEFAULT false,
  company text,
  vehicle_type text,
  vehicle_number text,
  is_available boolean DEFAULT true,
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  balance numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'UGX',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create vehicle_types table
CREATE TABLE IF NOT EXISTS vehicle_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity numeric NOT NULL,
  base_rate numeric(10,2) NOT NULL,
  per_km_rate numeric(10,2) NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES users(id),
  transporter_id uuid REFERENCES users(id),
  pickup_location jsonb NOT NULL,
  dropoff_location jsonb NOT NULL,
  current_location jsonb,
  description text,
  price numeric(12,2) NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'accepted', 'picked_up', 'in_transit', 'delivered', 'completed', 'cancelled')),
  vehicle_type_id uuid REFERENCES vehicle_types(id),
  distance numeric,
  duration numeric,
  start_time timestamptz,
  end_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tracking_records table
CREATE TABLE IF NOT EXISTS tracking_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  location jsonb NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  amount numeric(12,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'escrow', 'escrow_release', 'fee')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  reference text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create escrows table
CREATE TABLE IF NOT EXISTS escrows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  status text DEFAULT 'held' CHECK (status IN ('held', 'released', 'refunded')),
  created_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  rater_id uuid REFERENCES users(id),
  ratee_id uuid REFERENCES users(id),
  score integer CHECK (score >= 1 AND score <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Wallets policies
CREATE POLICY "Users can view own wallet" ON wallets
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Clients can create jobs" ON jobs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can view relevant jobs" ON jobs
  FOR SELECT TO authenticated
  USING (
    auth.uid() = client_id OR 
    auth.uid() = transporter_id OR 
    (auth.uid() IN (SELECT id FROM users WHERE role = 'transporter') AND status = 'pending')
  );

CREATE POLICY "Users can update own jobs" ON jobs
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = client_id OR 
    auth.uid() = transporter_id
  );

-- Tracking records policies
CREATE POLICY "Users can view job tracking" ON tracking_records
  FOR SELECT TO authenticated
  USING (
    job_id IN (
      SELECT id FROM jobs 
      WHERE client_id = auth.uid() OR transporter_id = auth.uid()
    )
  );

CREATE POLICY "Transporters can create tracking records" ON tracking_records
  FOR INSERT TO authenticated
  WITH CHECK (
    job_id IN (
      SELECT id FROM jobs 
      WHERE transporter_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Ratings policies
CREATE POLICY "Users can create ratings" ON ratings
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = rater_id AND
    job_id IN (
      SELECT id FROM jobs 
      WHERE client_id = auth.uid() OR transporter_id = auth.uid()
    )
  );

CREATE POLICY "Users can view job ratings" ON ratings
  FOR SELECT TO authenticated
  USING (
    job_id IN (
      SELECT id FROM jobs 
      WHERE client_id = auth.uid() OR transporter_id = auth.uid()
    )
  );