import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { db } from '../db/dexie.ts';

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  try {
    const settings = await db.settings.get('clinic-settings');
    const url = settings?.supabaseUrl?.trim() || import.meta.env.VITE_SUPABASE_URL || '';
    const key = settings?.supabaseAnonKey?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    if (!url || !key) {
      return null;
    }

    if (cachedClient && lastUrl === url && lastKey === key) {
      return cachedClient;
    }

    cachedClient = createClient(url, key, {
      auth: { persistSession: true },
    });
    lastUrl = url;
    lastKey = key;

    return cachedClient;
  } catch (err) {
    console.error('Error instantiating Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  if (!url || !key) {
    return { success: false, message: 'Please provide both Supabase URL and Anon Key.' };
  }

  try {
    const testClient = createClient(url.trim(), key.trim());
    // Try to query the customers table
    const { error } = await testClient.from('customers').select('id').limit(1);

    if (error) {
      // If table doesn't exist yet, it will return error like 'relation "customers" does not exist'
      if (error.message.includes('relation "customers" does not exist') || error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase! Note: Please run the provided SQL schema in your Supabase SQL editor to create the tables.',
        };
      }
      return { success: false, message: `Supabase Error: ${error.message}` };
    }

    return { success: true, message: 'Successfully connected to PostgreSQL database on Supabase!' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Connection failed. Please check network and URL.' };
  }
}
