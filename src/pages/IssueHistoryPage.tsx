import { useEffect, useState } from 'react';
import { Search, ArrowRight, Filter } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { TicketStatus, STATUS_LABEL } from '../data/mock';
import { api, Ticket, Meta } from '../lib/api';

interface Props { onNav: (p: string, id?: string) => void; }

export default function IssueHistoryPage({ onNav }: Props) {
  const [search, setSearch] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.meta().then(setMeta); }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api.listTickets({ search, building: filterBuilding, type: filterType, status: filterStatus })
        .then(d => setTickets(d.tickets))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [search, filterBuilding, filterType, filterStatus]);

  const statusOptions: { value: TicketStatus | ''; label: string }[] = [
    { value: '', label: 'ทุกสถานะ' },
    { value: 'pending', label: STATUS_LABEL.pending },
    { value: 'in_progress', label: STATUS_LABEL.in_progress },
    { value: 'resolved', label: STATUS_LABEL.resolved },
    { value: 'closed', label: STATUS_LABEL.closed },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ประวัติการแจ้งปัญหา</h1>
        <p className="text-gray-500 text-sm mt-1">ติดตามสถานะปัญหาที่คุณแจ้งทั้งหมด</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหา Ticket หรือสถานที่..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter size={13} /> กรอง:
          </div>
          <select value={filterBuilding} onChange={e => setFilterBuilding(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400">
            <option value="">ทุกอาคาร</option>
            {(meta?.buildings || []).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400">
            <option value="">ทุกประเภท</option>
            {(meta?.issueTypes || []).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {(filterBuilding || filterType || filterStatus || search) && (
            <button onClick={() => { setFilterBuilding(''); setFilterType(''); setFilterStatus(''); setSearch(''); }} className="text-xs text-red-500 hover:text-red-700 px-2">
              ล้างทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Ticket ID', 'วันที่', 'อาคาร', 'พื้นที่', 'ประเภทปัญหา', 'สถานะ', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">กำลังโหลด...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">ยังไม่มีรายการแจ้งปัญหา</td></tr>
            ) : tickets.map((t, i) => (
              <tr key={t.id} className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${i < tickets.length - 1 ? 'border-b border-gray-100' : ''}`}
                onClick={() => onNav('issue-detail', t.id)}>
                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-blue-700">#{t.id}</td>
                <td className="px-4 py-3.5 text-gray-600 text-xs">{t.createdAt.split(' ')[0]}</td>
                <td className="px-4 py-3.5 text-gray-800">{t.building}</td>
                <td className="px-4 py-3.5 text-gray-600">{t.area}</td>
                <td className="px-4 py-3.5 text-gray-800">{t.type}</td>
                <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3.5"><ArrowRight size={15} className="text-gray-300" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">กำลังโหลด...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">ยังไม่มีรายการแจ้งปัญหา</div>
        ) : tickets.map(t => (
          <button
            key={t.id}
            onClick={() => onNav('issue-detail', t.id)}
            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-mono text-xs font-bold text-blue-700">#{t.id}</span>
              <StatusBadge status={t.status} />
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">{t.type}</div>
            <div className="text-xs text-gray-500">{t.building} · {t.area}</div>
            <div className="text-xs text-gray-400 mt-1">{t.createdAt}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-400 text-right">แสดง {tickets.length} รายการ</div>
    </div>
  );
}
