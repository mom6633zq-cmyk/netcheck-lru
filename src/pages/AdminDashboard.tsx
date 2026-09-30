import { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { api, Ticket, Stats } from '../lib/api';

interface Props { onNav: (p: string, id?: string) => void; }

const PIE_COLORS = ['#1d4ed8', '#0ea5e9', '#6366f1', '#8b5cf6', '#a8a29e', '#f97316'];

export default function AdminDashboard({ onNav }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Ticket[]>([]);

  useEffect(() => {
    api.stats().then(setStats);
    api.listTickets().then(d => setRecent(d.tickets.slice(0, 5)));
  }, []);

  if (!stats) return <div className="p-6 text-sm text-gray-400">กำลังโหลด...</div>;

  const statCards = [
    { label: 'ปัญหาทั้งหมด', value: stats.total, sub: 'ทั้งหมดในระบบ', trend: 'up', color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'รอตรวจสอบ', value: stats.pending, sub: 'รอดำเนินการ', color: 'text-gray-700', bg: 'bg-gray-100' },
    { label: 'กำลังดำเนินการ', value: stats.inProgress, sub: 'ในมือเจ้าหน้าที่', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    { label: 'แก้ไขแล้ว', value: stats.resolved + stats.closed, sub: stats.total ? `${Math.round(((stats.resolved + stats.closed) / stats.total) * 100)}% อัตราสำเร็จ` : '—', trend: 'up', color: 'text-green-700', bg: 'bg-green-100' },
  ];

  const monthlyData = stats.byMonth.map(m => ({ month: m.month, total: m.total, resolved: m.resolved }));
  const issueTypeData = stats.byType.map((t, i) => ({ name: t.type, value: t.c, color: PIE_COLORS[i % PIE_COLORS.length] }));
  const buildingData = stats.byBuilding.map(b => ({ building: b.building, count: b.c }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">ภาพรวมปัญหาเครือข่ายภายในมหาวิทยาลัย</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-sm font-medium text-gray-700">{s.label}</div>
            <div className="flex items-center gap-1 mt-1">
              {s.trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
              <span className="text-xs text-gray-400">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">จำนวนปัญหาในแต่ละเดือน</h2>
          {monthlyData.length === 0 ? <div className="text-xs text-gray-400 py-10 text-center">ยังไม่มีข้อมูล</div> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="total" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} name="แจ้งปัญหา" />
                <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} name="แก้ไขแล้ว" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">ปัญหาแยกตามประเภท</h2>
          {issueTypeData.length === 0 ? <div className="text-xs text-gray-400 py-10 text-center">ยังไม่มีข้อมูล</div> : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={issueTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {issueTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {issueTypeData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-600 truncate">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Building Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">ปัญหาแยกตามอาคาร</h2>
        {buildingData.length === 0 ? <div className="text-xs text-gray-400 py-10 text-center">ยังไม่มีข้อมูล</div> : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={buildingData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="building" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1d4ed8" radius={[6, 6, 0, 0]} name="จำนวนปัญหา" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Issues Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">รายการแจ้งปัญหาล่าสุด</h2>
          <button onClick={() => onNav('admin-issues')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            ดูทั้งหมด →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Ticket', 'วันที่', 'อาคาร', 'ประเภท', 'สถานะ', 'ผู้รับผิดชอบ', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">ยังไม่มีรายการ</td></tr>
              ) : recent.map((t, i) => (
                <tr key={t.id} className={`hover:bg-blue-50/30 cursor-pointer transition-colors ${i < recent.length - 1 ? 'border-b border-gray-100' : ''}`}
                  onClick={() => onNav('admin-issue-detail', t.id)}>
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-700">#{t.id}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{t.createdAt.split(' ')[0]}</td>
                  <td className="px-4 py-3.5 text-gray-800">{t.building}</td>
                  <td className="px-4 py-3.5 text-gray-600">{t.type}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{t.assignee || '—'}</td>
                  <td className="px-4 py-3.5"><ArrowRight size={14} className="text-gray-300" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
