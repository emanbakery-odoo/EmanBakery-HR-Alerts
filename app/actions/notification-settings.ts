'use server'

import { supabase } from '@/lib/supabase'

export type NotificationSettings = {
  alert_threshold: number
  frequency: 'daily' | 'weekly'
  channels: string[]
}

export async function updateNotificationSettings(settings: NotificationSettings) {
  try {
    // Assuming a single row of settings for the entire system (admin configuration)
    // Using a fixed ID or similar logic depending on the schema requirements.
    // Here we'll upsert into the table. 
    // Usually, this table might have a primary key 'id'.
    const { data, error } = await supabase
      .from('notification_settings')
      .upsert({ 
        id: 1, // Fixed ID for global settings
        ...settings,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Supabase settings update error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Settings update error:', err)
    return { success: false, error: err.message }
  }
}

export async function getNotificationSettings() {
  try {
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
      console.error('Supabase settings fetch error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || null }
  } catch (err: any) {
    console.error('Settings fetch error:', err)
    return { success: false, error: err.message }
  }
}
