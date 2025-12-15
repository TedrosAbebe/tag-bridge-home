import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database initialization function
export async function initializeDatabase() {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table')
    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Error creating users table:', usersError)
    }

    // Create broker_info table
    const { error: brokerError } = await supabase.rpc('create_broker_info_table')
    if (brokerError && !brokerError.message.includes('already exists')) {
      console.error('Error creating broker_info table:', brokerError)
    }

    // Create system_config table
    const { error: configError } = await supabase.rpc('create_system_config_table')
    if (configError && !configError.message.includes('already exists')) {
      console.error('Error creating system_config table:', configError)
    }

    // Create properties table
    const { error: propertiesError } = await supabase.rpc('create_properties_table')
    if (propertiesError && !propertiesError.message.includes('already exists')) {
      console.error('Error creating properties table:', propertiesError)
    }

    // Create banners table
    const { error: bannersError } = await supabase.rpc('create_banners_table')
    if (bannersError && !bannersError.message.includes('already exists')) {
      console.error('Error creating banners table:', bannersError)
    }

    console.log('Database initialization completed')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// User operations
export const userOperations = {
  async create(id: string, username: string, passwordHash: string, role: string = 'user') {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id,
        username,
        password_hash: passwordHash,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findByUsername(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateLastLogin(id: string) {
    const { error } = await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw error
  },

  async update(id: string, username: string, role: string) {
    const { data, error } = await supabase
      .from('users')
      .update({
        username,
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePassword(id: string, passwordHash: string) {
    const { error } = await supabase
      .from('users')
      .update({
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

// Broker operations
export const brokerOperations = {
  async create(id: string, userId: string, fullName: string, email: string, phone: string, licenseNumber: string | null, experience: string, specialization: string) {
    const { data, error } = await supabase
      .from('broker_info')
      .insert({
        id,
        user_id: userId,
        full_name: fullName,
        email,
        phone,
        license_number: licenseNumber,
        experience,
        specialization,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findByUserId(userId: string) {
    const { data, error } = await supabase
      .from('broker_info')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateStatus(userId: string, status: string) {
    const { error } = await supabase
      .from('broker_info')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
    
    if (error) throw error
  },

  async delete(userId: string) {
    const { error } = await supabase
      .from('broker_info')
      .delete()
      .eq('user_id', userId)
    
    if (error) throw error
  },

  async deleteById(id: string) {
    const { error } = await supabase
      .from('broker_info')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getAll() {
    const { data, error } = await supabase
      .from('broker_info')
      .select(`
        *,
        users!inner(username, created_at)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getPending() {
    const { data, error } = await supabase
      .from('broker_info')
      .select(`
        *,
        users!inner(username, created_at)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getRejected() {
    const { data, error } = await supabase
      .from('broker_info')
      .select(`
        *,
        users!inner(username, created_at)
      `)
      .eq('status', 'rejected')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

// System configuration operations
export const systemConfig = {
  async set(key: string, value: string) {
    const { error } = await supabase
      .from('system_config')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
  },

  async get(key: string) {
    const { data, error } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async exists(key: string) {
    const { data, error } = await supabase
      .from('system_config')
      .select('key')
      .eq('key', key)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  },

  async isAdminSetupComplete() {
    const result = await this.get('admin_setup_complete')
    return result?.value === 'true'
  },

  async markAdminSetupComplete() {
    await this.set('admin_setup_complete', 'true')
  },

  async hasAdminUser() {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')
    
    if (error) throw error
    return (count || 0) > 0
  }
}

// Property operations
export const propertyOperations = {
  async create(propertyData: any) {
    const { data, error } = await supabase
      .from('properties')
      .insert({
        ...propertyData,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async findById(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getApproved() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getPending() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('properties')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Banner operations
export const bannerOperations = {
  async create(bannerData: any) {
    const { data, error } = await supabase
      .from('banners')
      .insert({
        ...bannerData,
        id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getActive() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, bannerData: any) {
    const { data, error } = await supabase
      .from('banners')
      .update({
        ...bannerData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export default supabase