-- Ethiopia Home Broker App - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication and role management)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'broker', 'user', 'advertiser')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System configuration table
CREATE TABLE IF NOT EXISTS system_config (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker information table
CREATE TABLE IF NOT EXISTS broker_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    license_number VARCHAR(255),
    experience TEXT NOT NULL,
    specialization TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('rent', 'sale')) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area DECIMAL(10,2),
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    subcity VARCHAR(100),
    woreda VARCHAR(100),
    images TEXT[], -- Array of image URLs
    contact_phone VARCHAR(50) NOT NULL,
    contact_whatsapp VARCHAR(50),
    broker_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    is_premium BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'verified')) DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners table (for promotional content)
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(255) NOT NULL,
    title_am VARCHAR(255) NOT NULL,
    message_en TEXT NOT NULL,
    message_am TEXT NOT NULL,
    banner_type VARCHAR(50) DEFAULT 'promotion',
    background_color VARCHAR(20) DEFAULT '#3B82F6',
    text_color VARCHAR(20) DEFAULT '#FFFFFF',
    icon VARCHAR(10) DEFAULT '🏠',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advertiser applications table
CREATE TABLE IF NOT EXISTS advertiser_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    business_address TEXT,
    website VARCHAR(255),
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table (for tracking property listing payments)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'verified')) DEFAULT 'pending',
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_broker_info_user_id ON broker_info(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_info_status ON broker_info(status);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_broker_id ON properties(broker_id);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_advertiser_applications_status ON advertiser_applications(status);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_broker_info_updated_at BEFORE UPDATE ON broker_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_advertiser_applications_updated_at BEFORE UPDATE ON advertiser_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertiser_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON users FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON system_config FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON system_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON system_config FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON system_config FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON broker_info FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON broker_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON broker_info FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON broker_info FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON properties FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON properties FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON properties FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON banners FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON banners FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON banners FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON advertiser_applications FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON advertiser_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON advertiser_applications FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON advertiser_applications FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON payments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON payments FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON payments FOR DELETE USING (true);