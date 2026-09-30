import { useEffect, useState } from 'react';
import { Wifi, Download, Upload, Activity, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api, Ticket } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Props { onNav: (p: string, id?: string) => void; }

export default function UserDashboard({ onNav }: Props) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestTest, setLatestTest] = useState<{ download_mbps: number; upload_mbps: number; ping_ms: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([api.listTickets(), api.nettestLatest()])
      .then(([t, n]) => {
        if (!mounted) return;
        setTickets(t.tickets);
        setLatestTest(n.result);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const recent = tickets.slice(0, 3);

  const statCards = [
    { label: 'สถานะเครือข่าย', value: latestTest ? 'ตรวจสอบล่าสุด' : 'ยังไม่เคยทดสอบ', sub: 'กดตรวจสอบเครือข่าย', icon: Wifi, color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500' },
    { label: 'Download', value: latestTest ? latestTest.download_mbps.toFixed(1) : '—', unit: 'Mbps', icon: Download, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Upload', value: latestTest ? latestTest.upload_mbps.toFixed(1) : '—', unit: 'Mbps', icon: Upload, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Ping', value: latestTest ? Math.round(latestTest.ping_ms) : '—', unit: 'ms', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const ticketStats = [
    { label: 'รอตรวจสอบ', count: tickets.filter(t => t.status === 'pending').length, color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock },
    { label: 'กำลังดำเนินการ', count: tickets.filter(t => t.status === 'in_progress').length, color: 'text-yellow-700', bg: 'bg-yellow-100', icon: AlertCircle },
    { label: 'แก้ไขแล้ว', count: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length, color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">สวัสดี 👋 {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">ตรวจสอบสถานะเครือข่ายของคุณได้ที่นี่</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon size={18} className={card.color} />
            </div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold text-gray-900">{card.value}</span>
              {card.unit && <span className="text-xs text-gray-500 mb-0.5">{card.unit}</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {card.dot && <span className={`w-1.5 h-1.5 rounded-full ${card.dot}`} />}
              <span className="text-xs text-gray-500">{card.sub || card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Actions + Recent */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">การดำเนินการด่วน</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onNav('network-test')}
                className="flex items-center gap-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl p-5 transition-colors group"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Wifi size={22} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">ตรวจสอบเครือข่าย</div>
                  <div className="text-xs text-blue-200 mt-0.5">วัดความเร็ว Download / Upload / Ping</div>
                </div>
                <ArrowRight size={18} className="ml-auto group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNav('report-issue')}
                className="flex items-center gap-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-5 transition-colors group"
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={22} className="text-red-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">แจ้งปัญหา</div>
                  <div className="text-xs text-gray-500 mt-0.5">แจ้งปัญหาอินเทอร์เน็ตเพื่อรับการแก้ไข</div>
                </div>
                <ArrowRight size={18} className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent Tickets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">การแจ้งปัญหาล่าสุด</h2>
              <button onClick={() => onNav('issue-history')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                ดูทั้งหมด →
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="text-center py-10 text-gray-400 text-sm">กำลังโหลด...</div>
              ) : recent.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">ยังไม่มีรายการแจ้งปัญหา</div>
              ) : recent.map((ticket, i) => (
                <button
                  key={ticket.id}
                  onClick={() => onNav('issue-detail', ticket.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left ${i < recent.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-medium text-blue-600">#{ticket.id}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate">{ticket.type}</div>
                    <div className="text-xs text-gray-500">{ticket.building} · {ticket.area}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-400">{ticket.createdAt.split(' ')[0]}</div>
                    <ArrowRight size={14} className="text-gray-300 mt-1 ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Ticket Status Summary */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">สถานะการแจ้งปัญหา</h2>
          <div className="space-y-3">
            {ticketStats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{s.count}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <div className="text-xs font-semibold text-blue-700 mb-2">ข้อมูลผู้ใช้</div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between"><span>Email</span><span className="font-medium text-gray-800">{user?.email}</span></div>
              <div className="flex justify-between"><span>บทบาท</span><span className="font-medium text-gray-800">นักศึกษา</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
