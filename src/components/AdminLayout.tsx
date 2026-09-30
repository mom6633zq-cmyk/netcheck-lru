import { useState } from 'react';
import {
  LayoutDashboard, ListTodo, BarChart2, History, Users, Settings,
  LogOut, Wifi, Menu, X, ChevronRight
} from 'lucide-react';

type Page = string;

interface Props {
  page: Page;
  onNav: (p: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { key: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'admin-issues', label: 'รายการแจ้งปัญหา', icon: ListTodo },
  { key: 'admin-analytics', label: 'Analytics', icon: BarChart2 },
  { key: 'admin-history', label: 'ประวัติการดำเนินงาน', icon: History },
  { key: 'admin-users', label: 'จัดการผู้ใช้งาน', icon: Users },
  { key: 'admin-settings', label: 'ตั้งค่าระบบ', icon: Settings },
];

export default function AdminLayout({ page, onNav, onLogout, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-blue-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Wifi size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">NetCheck LRU</div>
            <div className="text-[10px] text-blue-300 leading-tight">ระบบจัดการ</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { onNav(key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              page === key
                ? 'bg-white/15 text-white'
                : 'text-blue-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            {page === key && <ChevronRight size={13} className="opacity-60" />}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-blue-800">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            ว
          </div>
          <div>
            <div className="text-xs font-medium text-white">นายวิชัย เทคโน</div>
            <div className="text-[10px] text-blue-300">เจ้าหน้าที่ IT</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={15} /> ออกจากระบบ
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-blue-900 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-blue-900 flex-shrink-0">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-1 text-gray-500">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-800">NetCheck LRU — Admin</span>
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
