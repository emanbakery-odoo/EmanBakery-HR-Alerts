'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { updateNotificationSettings, getNotificationSettings, NotificationSettings } from '@/app/actions/notification-settings'
import { toast } from 'sonner'
import { Loader2, Save, BellRing, Mail, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NotificationSettingsUI() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [settings, setSettings] = useState<NotificationSettings>({
    alert_threshold: 30,
    frequency: 'daily',
    channels: ['email']
  })

  useEffect(() => {
    async function loadSettings() {
      const result = await getNotificationSettings()
      if (result.success && result.data) {
        setSettings({
          alert_threshold: result.data.alert_threshold,
          frequency: result.data.frequency,
          channels: result.data.channels
        })
      }
      setFetching(false)
    }
    loadSettings()
  }, [])

  const handleChannelChange = (channel: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      channels: checked 
        ? [...prev.channels, channel]
        : prev.channels.filter(c => c !== channel)
    }))
  }

  async function handleSave() {
    setLoading(true)
    const result = await updateNotificationSettings(settings)
    setLoading(false)

    if (result.success) {
      toast.success('Notification rules updated.')
      router.refresh()
    } else {
      toast.error(`Error: ${result.error}`)
    }
  }

  if (fetching) {
    return (
      <Card className="w-full border-none shadow-xl bg-white/50 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-none shadow-xl bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <BellRing className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-xl font-bold tracking-tight text-slate-800">Alert Automation Rules</CardTitle>
        </div>
        <CardDescription className="text-slate-500">
          Define your system's criteria for triggering Iqama expiry alerts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="threshold" className="text-sm font-semibold text-slate-700">Warning Threshold</Label>
            <Select 
              value={String(settings.alert_threshold)} 
              onValueChange={(val) => setSettings(prev => ({ ...prev, alert_threshold: parseInt(val) }))}
            >
              <SelectTrigger id="threshold" className="h-11 bg-white border-slate-200">
                <SelectValue placeholder="Select threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days Before Expiry</SelectItem>
                <SelectItem value="60">60 Days Before Expiry</SelectItem>
                <SelectItem value="90">90 Days Before Expiry</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-slate-400">First alert will trigger at this milestone.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-sm font-semibold text-slate-700">Check Frequency</Label>
            <Select 
              value={settings.frequency} 
              onValueChange={(val: 'daily' | 'weekly') => setSettings(prev => ({ ...prev, frequency: val }))}
            >
              <SelectTrigger id="frequency" className="h-11 bg-white border-slate-200">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Run (Recommended)</SelectItem>
                <SelectItem value="weekly">Weekly Run</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-slate-400">How often the system scans for expiries.</p>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-slate-700">Delivery Channels</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                settings.channels.includes('email') ? "border-slate-900 bg-slate-50" : "border-slate-100 hover:border-slate-200 bg-white"
              )}
              onClick={() => handleChannelChange('email', !settings.channels.includes('email'))}
            >
              <Checkbox 
                id="email" 
                checked={settings.channels.includes('email')}
                className="data-[state=checked]:bg-slate-900"
              />
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">Email Alerts</span>
                  <span className="text-[10px] text-slate-500">To HR Department</span>
                </div>
              </div>
            </div>

            <div 
              className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer",
                settings.channels.includes('whatsapp') ? "border-slate-900 bg-slate-50" : "border-slate-100 hover:border-slate-200 bg-white"
              )}
              onClick={() => handleChannelChange('whatsapp', !settings.channels.includes('whatsapp'))}
            >
              <Checkbox 
                id="whatsapp" 
                checked={settings.channels.includes('whatsapp')}
                className="data-[state=checked]:bg-slate-900"
              />
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-slate-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">WhatsApp</span>
                  <span className="text-[10px] text-slate-500">To Management</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all" onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Rules...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Apply Configuration
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
