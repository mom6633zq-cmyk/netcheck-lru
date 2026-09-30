import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Archive } from 'lucide-react';
import { api, HistoryData } from '../lib/api';

interface Props { onNav: (p: string, id?: string) => void; }

// ป้ายสถานะในตารางประวัติ (ภาพประกอบ 3-16): pending = "รับเรื่อง"
const ACTION: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: 'รับเรื่อง', cls: 'bg-gray-100 text-gray-600', icon: Clock },
  in_progress: { label: 'กำลังดำเนินการ', cls: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  resolved: { label: 'แก้ไขแล้ว', cls: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  closed: { label: 'ปิดงาน', cls: 'bg-blue-100 text-blue-700', icon: Archive },
};

export default function AdminHistory({ onNav }: Props) {
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { api.history().then(setData).catch(e => setError(e.message)); }, []);

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!data) return <div className="p-6 text-sm text-gray-400">กำลังโหลด...</div>;

  const cards = [
    { label: 'การดำเนินการทั้งหมด', value: data.summary.total, color: 'text-purple-700' },
    { label: 'แก้ไขแล้ว', value: data.summary.resolved, color: 'text-green-700' },
    { label: 'ปิดงาน', value: data.summary.closed, color: 'text-blue-700' },
    { label: 'กำลังดำเนินการ', value: data.summary.in_progress, color: 'text-amber-600' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">ประวัติการดำเนินงาน</h1>
        <p className="text-sm text-gray-500">บันทึกการดำเนินงานของเจ้าหน้าที่ทั้งหมด</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 text-sm font-semibold text-gray-700">ลำดับการดำเนินงาน</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['เวลา', 'TICKET', 'การดำเนินการ', 'โดย', 'หมายเหตุ'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">ยังไม่มีประวัติการดำเนินงาน</td></tr>
              ) : data.items.map((h, i) => {
                const a = ACTION[h.status] ?? ACTION.pending;
                return (
                  <tr key={h.id} className={i < data.items.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{h.time.slice(0, 16)}</td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => onNav('admin-issue-detail', h.ticket)} className="font-mono text-xs font-bold text-blue-700 hover:underline">#{h.ticket}</button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${a.cls}`}>
                        <a.icon size={12} /> {a.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{h.by || '—'}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{h.note || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
