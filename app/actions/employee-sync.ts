'use server'

import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'

export async function syncEmployees(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'No file uploaded' }
    }

    const bytes = await file.arrayBuffer()
    const workbook = XLSX.read(bytes, { 
      type: 'array',
      cellDates: true,
      cellNF: false,
      cellText: false
    })
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) {
      return { success: false, error: 'Excel file is empty' }
    }
    
    const sheet = workbook.Sheets[sheetName]
    const rawData = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: 'yyyy-mm-dd' }) as any[]

    if (rawData.length === 0) {
      return { success: false, error: 'No data found in the Excel sheet' }
    }

    // Define flexible header mappings
    const headerMap = {
      name: ['Name', 'Employee Name', 'الاسم', 'full_name'],
      iqama_number: ['Iqama Number', 'Iqama', 'ID Number', 'رقم الإقامة', 'iqama_number'],
      iqama_expiry: ['Iqama Expiry', 'Expiry Date', 'تاريخ الانتهاء', 'iqama_expiry'],
      nationality: ['Nationality', 'الجنسية', 'nationality'],
      job_title: ['Job Title', 'Job', 'المهنة', 'job_title'],
      department: ['Department', 'Dept', 'القسم', 'department'],
      status: ['Status', 'الحالة', 'status']
    }

    // Helper to find value by flexible keys
    const getValue = (row: any, aliases: string[]) => {
      const rowKeys = Object.keys(row)
      const foundKey = rowKeys.find(key => 
        aliases.some(alias => key.toLowerCase().trim() === alias.toLowerCase().trim())
      )
      return foundKey ? String(row[foundKey]).trim() : null
    }

    // Map rows with safety fallbacks
    const employees = rawData.map((row: any) => {
      const iqama = getValue(row, headerMap.iqama_number)
      if (!iqama) return null // Skip rows without iqama number

      return {
        name: getValue(row, headerMap.name) || 'Unknown',
        iqama_number: iqama,
        iqama_expiry: getValue(row, headerMap.iqama_expiry),
        nationality: getValue(row, headerMap.nationality) || 'N/A',
        job_title: getValue(row, headerMap.job_title) || 'N/A',
        department: getValue(row, headerMap.department) || 'N/A',
        status: getValue(row, headerMap.status) || 'Active'
      }
    }).filter(emp => emp !== null)

    if (employees.length === 0) {
      return { success: false, error: 'No valid employee records found. Check your column headers.' }
    }

    const { error } = await supabase
      .from('employees')
      .upsert(employees, { 
        onConflict: 'iqama_number',
        ignoreDuplicates: false 
      })

    if (error) {
      console.error('Supabase UPSERT error:', error)
      return { success: false, error: `Database Error: ${error.message}` }
    }

    return { success: true, count: employees.length }
  } catch (err: any) {
    console.error('Critical sync error:', err)
    return { success: false, error: err.message || 'An unexpected error occurred during synchronization' }
  }
}
