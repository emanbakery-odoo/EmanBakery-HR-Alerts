import nodemailer from 'nodemailer'

/**
 * PRODUCTION NOTIFICATION CHANNELS (PHASE 6)
 * Integration with SMTP for Email and REST API for WhatsApp.
 */

// Email Transport Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendConsolidatedEmailAlert(alerts: any[]) {
  const adminEmail = process.env.ADMIN_EMAIL || 'hr@emanbakery.com'
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[EMAIL SKIP] SMTP credentials missing in .env')
    return { success: false, error: 'Missing configuration' }
  }

  if (alerts.length === 0) return { success: true, message: 'No alerts to send' }

  const tableRows = alerts.map(alert => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9;">${alert.name}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9;">${alert.iqama_number}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9; color: #ea580c; font-weight: bold;">${alert.expiry_date || alert.iqama_expiry}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f1f5f9;">${alert.days_remaining}</td>
    </tr>
  `).join('')

  try {
    const info = await transporter.sendMail({
      from: `"EmanBakery Alerts" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `⚠️ ALERT: ${alerts.length} Iqama Expiries Detected`,
      html: `
        <div style="font-family: sans-serif; color: #334155; max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px;">Daily Iqama Expiry Report</h1>
            <p style="margin: 8px 0 0; opacity: 0.8;">Action required for the following employees</p>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th style="padding: 12px 8px; border-bottom: 2px solid #e2e8f0;">Employee Name</th>
                  <th style="padding: 12px 8px; border-bottom: 2px solid #e2e8f0;">Iqama Number</th>
                  <th style="padding: 12px 8px; border-bottom: 2px solid #e2e8f0;">Expiry Date</th>
                  <th style="padding: 12px 8px; border-bottom: 2px solid #e2e8f0;">Days Left</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            <div style="margin-top: 24px; padding: 16px; background-color: #fff7ed; border-left: 4px solid #ea580c; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #9a3412; font-weight: bold;">
                Action Required:
              </p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #c2410c;">
                Please log in to the Muqeem portal to initiate the renewal process for these employees to avoid penalties.
              </p>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
            © 2026 EmanBakery Enterprise HR Automation • Managed System Alert
          </div>
        </div>
      `,
    })
    console.log(`[EMAIL] Consolidated alert sent (${alerts.length} employees)`)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error(`[EMAIL ERROR] Failed to send consolidated alert:`, error)
    return { success: false, error: error.message }
  }
}

export async function sendConsolidatedWhatsAppAlert(alerts: any[]) {
  const apiUrl = process.env.WHATSAPP_API_URL
  const apiToken = process.env.WHATSAPP_API_TOKEN
  const adminPhone = process.env.ADMIN_PHONE

  if (!apiUrl || !apiToken || !adminPhone) {
    console.warn('[WHATSAPP SKIP] API credentials or phone number missing in .env')
    return { success: false, error: 'Missing configuration' }
  }

  if (alerts.length === 0) return { success: true, message: 'No alerts to send' }

  let message = `⚠️ *EmanBakery Iqama Alert* ⚠️\n\n`
  message += `Found *${alerts.length}* employees nearing expiry:\n\n`
  
  alerts.forEach((alert, index) => {
    message += `${index + 1}. *${alert.name}*\n`
    message += `   Iqama: ${alert.iqama_number}\n`
    message += `   Expiry: ${alert.expiry_date || alert.iqama_expiry}\n`
    message += `   Remaining: ${alert.days_remaining} days\n\n`
  })

  message += `_Please process renewals in Muqeem portal immediately._`

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        to: adminPhone,
        type: 'text',
        text: { body: message }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`WhatsApp API responded with ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log(`[WHATSAPP] Consolidated alert sent (${alerts.length} employees)`)
    return { success: true, data }
  } catch (error: any) {
    console.error(`[WHATSAPP ERROR] Failed to send consolidated alert:`, error)
    return { success: false, error: error.message }
  }
}

export async function dispatchAlerts(alerts: any[]) {
  if (alerts.length === 0) return []

  const results: any = { 
    count: alerts.length,
    channels: [] 
  }
  
  // Determine channels from the first alert (assuming they are consistent)
  const channels = alerts[0].channels || []
  
  // Dispatch Consolidated Email
  if (channels.includes('email')) {
    const emailResult = await sendConsolidatedEmailAlert(alerts)
    if (emailResult.success) results.channels.push('email')
  }
  
  // Dispatch Consolidated WhatsApp
  if (channels.includes('whatsapp')) {
    const waResult = await sendConsolidatedWhatsAppAlert(alerts)
    if (waResult.success) results.channels.push('whatsapp')
  }
  
  return results
}

