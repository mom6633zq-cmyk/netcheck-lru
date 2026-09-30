import { useState } from 'react';
import {
  LayoutDashboard, Wifi, AlertCircle, ClockIcon, User, Bell, ChevronDown,
  LogOut, Settings, Menu, X
} from 'lucide-react';

type Page = string;

interface Props {
  page: Page;
  onNav: (p: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'network-test', label: 'ตรวจสอบเครือข่าย', icon: Wifi },
  { key: 'report-issue', label: 'แจ้งปัญหา', icon: AlertCircle },
  { key: 'issue-history', label: 'ประวัติการแจ้งปัญหา', icon: ClockIcon },
];

const NOTIFICATIONS = [
  { id: 'NET-0001', color: 'bg-blue-500', msg: 'เจ้าหน้าที่รับเรื่องแจ้งปัญหาของคุณแล้ว', time: '2 ชม. ที่แล้ว' },
  { id: 'NET-0002', color: 'bg-yellow-400', msg: 'กำลังดำเนินการแก้ไขปัญหา', time: '1 วันที่แล้ว' },
  { id: 'NET-0004', color: 'bg-green-500', msg: 'แก้ไขปัญหาเรียบร้อยแล้ว', time: '2 วันที่แล้ว' },
];

export default function UserLayout({ page, onNav, onLogout, children }: Props) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNav('dashboard')}>
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <Wifi size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900 leading-tight">NetCheck LRU</div>
                <div className="text-[10px] text-gray-500 leading-tight">ม.ราชภัฏเลย</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1 ml-6">
              {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => onNav(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-sm text-gray-800">การแจ้งเตือน</p>
                  </div>
                  {NOTIFICATIONS.map((n) => (
                    <button
                      key={n.id}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                      onClick={() => { onNav('issue-detail'); setNotifOpen(false); }}
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800">Ticket #{n.id}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{n.msg}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  ส
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">นายสมชาย</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  <button onClick={() => { onNav('profile'); setProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User size={14} /> โปรไฟล์
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings size={14} /> ตั้งค่า
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={14} /> ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { onNav(key); setMenuOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 ${
                  page === key ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        )}
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
