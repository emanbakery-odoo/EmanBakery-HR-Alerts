import { ExcelUpload } from "@/components/excel-upload";
import { NotificationSettingsUI } from "@/components/notification-settings";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Radio, Settings2, LayoutDashboard, Menu, UserCircle, CheckCircle2 } from "lucide-react";
import { getDashboardStats } from "@/app/actions/dashboard-stats";
import { cn } from "@/lib/utils";

export default async function Home() {
  const statsResult = await getDashboardStats();
  const stats = (statsResult.success && statsResult.stats) ? statsResult.stats : { totalEmployees: 0, upcomingExpiries: 0, activeChannels: [] as string[], upcomingEmployees: [] as any[] };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Settings2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">EmanBakery</h1>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">HR Portal</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-semibold text-slate-900">Admin User</span>
              <span className="text-[10px] text-slate-400">System Manager</span>
            </div>
            <UserCircle className="h-8 w-8 text-slate-300" />
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Dashboard Header area */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Control Center
          </h2>
          <p className="mt-2 text-lg text-slate-500 font-medium">
            Muqeem Expiry Tracker & Automation Hub
          </p>
        </div>

        {/* Summary Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Total Employees</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stats.totalEmployees}</h3>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-slate-100 transition-colors">
                  <Users className="h-6 w-6 text-slate-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-none font-bold text-[10px]">ACTIVE ROSTER</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Upcoming Expiries</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stats.upcomingExpiries}</h3>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-none font-bold text-[10px]">NEXT 30 DAYS</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Active Channels</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stats.activeChannels.length}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <Radio className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {stats.activeChannels.map((channel: string) => (
                  <Badge key={channel} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none font-bold text-[10px] uppercase">
                    {channel}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Tabs Integration */}
        <div className="w-full">
          <Tabs defaultValue="sync" className="w-full">
            <div className="flex items-center justify-between mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="sync" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2.5 font-bold text-slate-600 data-[state=active]:text-slate-900 transition-all">
                  Data Ingestion
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2.5 font-bold text-slate-600 data-[state=active]:text-slate-900 transition-all">
                  Expiry Monitor
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2.5 font-bold text-slate-600 data-[state=active]:text-slate-900 transition-all">
                  Notification Rules
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="sync" className="mt-0 focus-visible:outline-none outline-none">
              <div className="max-w-2xl">
                <ExcelUpload />
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-0 focus-visible:outline-none outline-none">
              <Card className="border-none shadow-sm bg-white overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Critical Expiries</h3>
                    <p className="text-sm text-slate-500">Employees requiring immediate renewal action.</p>
                  </div>
                  <Badge variant="outline" className="font-bold">{stats.upcomingEmployees.length} RECORDS</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">Employee</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">Iqama Number</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">Expiry Date</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.upcomingEmployees.length > 0 ? (
                        stats.upcomingEmployees.map((emp: any) => (
                          <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">{emp.name}</span>
                                <span className="text-[11px] text-slate-400 uppercase">{emp.job_title} • {emp.department}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{emp.iqama_number}</td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "text-sm font-bold",
                                new Date(emp.iqama_expiry) <= new Date() ? "text-red-500" : "text-orange-600"
                              )}>
                                {emp.iqama_expiry}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-none text-[10px] font-bold">RENEWAL DUE</Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="bg-green-50 p-3 rounded-full">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                              </div>
                              <p className="text-sm font-bold text-slate-900">All Clear</p>
                              <p className="text-xs text-slate-400">No employees are currently within the warning threshold.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0 focus-visible:outline-none outline-none">
              <div className="max-w-2xl">
                <NotificationSettingsUI />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="mt-auto border-t bg-white py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            © 2026 EmanBakery Enterprise HR
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Documentation</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Support</a>
          </div>
        </div>
      </footer>
      
      <Toaster position="top-right" expand={false} richColors />
    </div>
  );
}
