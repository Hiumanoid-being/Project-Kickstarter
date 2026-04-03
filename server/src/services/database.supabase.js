/**
 * Supabase Database Service
 * 
 * This is a placeholder for Supabase-specific database operations.
 * Add your Supabase queries and models here.
 */

import { getDb } from './database.js';

export const supabaseService = {
  // User operations
  async createUser(userData) {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .insert([{
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id) {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateUser(id, userData) {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteUser(id) {
    const supabase = getDb();
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { deleted: true };
  },

  // Initialize database schema
  async initializeSchema() {
    const supabase = getDb();
    
    // Create users table if it doesn't exist
    const { error } = await supabase.rpc('create_users_table');
    
    if (error && error.code !== '42710') { // 42710 = table already exists
      console.log('Note: Manual schema setup may be required for Supabase');
    }
    
    console.log('Supabase schema initialized');
  }
};