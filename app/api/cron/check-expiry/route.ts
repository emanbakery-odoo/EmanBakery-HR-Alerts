import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    // 1. Fetch Notification Settings
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (settingsError) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    const threshold = settings.alert_threshold || 30
    const today = new Date()
    const targetDate = new Date()
    targetDate.setDate(today.getDate() + threshold)

    // 2. Query Employees whose Iqama expires on or before the target date
    // Note: In a real scenario, we'd filter for employees not already notified
    const { data: employees, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .lte('iqama_expiry', targetDate.toISOString().split('T')[0])
      .eq('status', 'Active')

    if (employeeError) {
      return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 })
    }

    // 3. Dispatch Alerts (Phase 6 Implementation)
    const alerts = employees.map(emp => ({
      employee_id: emp.id,
      name: emp.name,
      iqama_number: emp.iqama_number,
      expiry_date: emp.iqama_expiry,
      days_remaining: Math.ceil((new Date(emp.iqama_expiry).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      channels: settings.channels
    }))

    const { dispatchAlerts } = await import('@/lib/notifications')
    const results = await dispatchAlerts(alerts)

    return NextResponse.json({
      success: true,
      processed_at: new Date().toISOString(),
      alerts_count: alerts.length,
      dispatched: results
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
