'use server'

import { supabase } from '@/lib/supabase'

export async function getDashboardStats() {
  try {
    // 0. Fetch Alert Threshold
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('alert_threshold, channels')
      .eq('id', 1)
      .single()

    const threshold = settings?.alert_threshold || 30
    const today = new Date().toISOString().split('T')[0]
    const thresholdDate = new Date()
    thresholdDate.setDate(thresholdDate.getDate() + threshold)
    const thresholdStr = thresholdDate.toISOString().split('T')[0]

    // 1. Total Employees
    const { count: totalCount, error: totalError } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Active')

    // 2. Upcoming Expiries (based on threshold)
    const { data: upcomingEmployees, count: upcomingCount, error: upcomingError } = await supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .eq('status', 'Active')
      .lte('iqama_expiry', thresholdStr)
      .gte('iqama_expiry', today)
      .order('iqama_expiry', { ascending: true })

    return {
      success: true,
      stats: {
        totalEmployees: totalCount || 0,
        upcomingExpiries: upcomingCount || 0,
        activeChannels: settings?.channels || [],
        upcomingEmployees: upcomingEmployees || []
      }
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
