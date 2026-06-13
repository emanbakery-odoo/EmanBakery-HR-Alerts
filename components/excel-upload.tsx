'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { syncEmployees } from '@/app/actions/employee-sync'
import { toast } from 'sonner'
import { Loader2, Upload, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ExcelUpload() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await syncEmployees(formData)

    setLoading(false)

    if (result.success) {
      toast.success(`Successfully synced ${result.count} employees.`, {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
      })
      router.refresh()
      setFileName(null)
      event.currentTarget.reset()
    } else {
      toast.error(`Sync Failed: ${result.error}`)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleContainerClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full border-none shadow-xl bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <FileSpreadsheet className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl font-bold tracking-tight text-slate-800">Muqeem Data Sync</CardTitle>
        </div>
        <CardDescription className="text-slate-500">
          Upload your latest Excel export from Muqeem to update employee records.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={cn(
              "relative group cursor-pointer transition-all duration-200",
              "flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl",
              dragActive ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={() => setDragActive(false)}
            onClick={handleContainerClick}
          >
            <Upload className={cn(
              "h-12 w-12 mb-4 transition-colors duration-200",
              dragActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-500"
            )} />
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-700">
                {fileName ? fileName : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-slate-400">Excel files only (.xlsx, .xls)</p>
            </div>
            <Input 
              id="file" 
              name="file" 
              type="file" 
              accept=".xlsx, .xls" 
              required 
              disabled={loading}
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold transition-all active:scale-[0.98] bg-slate-900 hover:bg-slate-800 text-white" 
            disabled={loading || !fileName}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Records...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Synchronize Database
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
