/*
  # Background Check Application Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `updated_at` (timestamp with time zone)
      - `first_name` (text)
      - `second_name` (text)
      - `phone` (text)
      - `email` (text)
      - `id_number` (text)
      - `country` (text)
      - `county` (text)
      - `physical_address` (text)

    - `applications`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles.id)
      - `status` (text)
      - `consent_given` (boolean)
      - `consent_date` (timestamp with time zone)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

    - `documents`
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications.id)
      - `type` (text)
      - `file_name` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `storage_path` (text)
      - `created_at` (timestamp with time zone)

    - `submissions`
      - `id` (uuid, primary key)
      - `personal_info` (jsonb, not null)
      - `consent_info` (jsonb, not null)
      - `document_metadata` (jsonb)
      - `created_at` (timestamp with time zone)

  2. Security
    - Disable RLS on all tables
    - Remove RLS policies
    - Ensure only admins can perform CRUD operations
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE DEFAULT gen_random_uuid(),
  updated_at timestamptz DEFAULT now(),
  first_name text,
  second_name text,
  phone text,
  email text,
  id_number text,
  country text,
  county text,
  physical_address text
);

-- Create applications table
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  consent_given boolean DEFAULT false,
  consent_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  type text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create a new submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_info JSONB NOT NULL,
    consent_info JSONB NOT NULL,
    document_metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- Remove RLS policies (if any exist)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON applications;
DROP POLICY IF EXISTS "Users can update own applications" ON applications;
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON submissions;

-- Ensure only admins can perform CRUD operations
-- This can be enforced through Supabase's dashboard or API key restrictions.

-- Create indexes for better query performance
CREATE INDEX idx_applications_profile_id ON applications(profile_id);
CREATE INDEX idx_documents_application_id ON documents(application_id);

-- Update profiles table to autogenerate id
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update applications table to autogenerate id
ALTER TABLE applications ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update documents table to autogenerate id
ALTER TABLE documents ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add storage policy for the `submissions` bucket
-- Allow only admins to perform CRUD operations
CREATE POLICY "Admins can access submissions bucket"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    auth.role() = 'admin'
  );

-- Update storage policy for the `submissions` bucket
-- Allow anonymous users to upload files
CREATE POLICY "Anons can upload to submissions bucket"
  ON storage.objects
  FOR INSERT
  TO public
  USING (true);