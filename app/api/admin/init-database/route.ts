import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import { supabase } from '../../../../lib/supabase-database'

export async function POST(request: NextRequest) {
  console.log('🗄️ Database initialization API called')
  
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('✅ Admin authenticated, initializing database...')

    // Create users table
    const { error: usersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (usersError) {
      console.error('❌ Users table creation error:', usersError)
    } else {
      console.log('✅ Users table created/verified')
    }

    // Create properties table
    const { error: propertiesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS properties (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(15,2) NOT NULL,
          currency VARCHAR(10) DEFAULT 'ETB',
          city VARCHAR(100) NOT NULL,
          area VARCHAR(100) NOT NULL,
          type VARCHAR(50) NOT NULL,
          bedrooms INTEGER,
          bathrooms INTEGER,
          size DECIMAL(10,2),
          features TEXT[],
          images TEXT[],
          status VARCHAR(50) DEFAULT 'pending',
          whatsapp_number VARCHAR(20),
          phone_number VARCHAR(20),
          owner_id UUID,
          owner_name VARCHAR(255),
          owner_role VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (propertiesError) {
      console.error('❌ Properties table creation error:', propertiesError)
    } else {
      console.log('✅ Properties table created/verified')
    }

    // Create broker_info table
    const { error: brokerError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS broker_info (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          license_number VARCHAR(100),
          experience VARCHAR(255),
          specialization VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (brokerError) {
      console.error('❌ Broker info table creation error:', brokerError)
    } else {
      console.log('✅ Broker info table created/verified')
    }

    // Create system_config table
    const { error: configError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS system_config (
          key VARCHAR(255) PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (configError) {
      console.error('❌ System config table creation error:', configError)
    } else {
      console.log('✅ System config table created/verified')
    }

    return NextResponse.json({
      success: true,
      message: 'Database tables initialized successfully',
      tables: ['users', 'properties', 'broker_info', 'system_config'],
      errors: {
        users: usersError?.message || null,
        properties: propertiesError?.message || null,
        broker_info: brokerError?.message || null,
        system_config: configError?.message || null
      }
    })

  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}