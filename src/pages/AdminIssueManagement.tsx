import { useEffect, useState } from 'react';
import { Search, Download, MoreVertical, Filter } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { TicketStatus, STATUS_LABEL } from '../data/mock';
import { api, Ticket, Meta } from '../lib/api';

interface Props { onNav: (p: string, id?: string) => void; }

export default function AdminIssueManagement({ onNav }: Props) {
  const [search, setSearch] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 5;

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

  const totalPages = Math.max(1, Math.ceil(tickets.length / perPage));
  const paged = tickets.slice((page - 1) * perPage, page * perPage);

  const statusOptions: { value: TicketStatus | ''; label: string }[] = [
    { value: '', label: 'ทุกสถานะ' },
    { value: 'pending', label: STATUS_LABEL.pending },
    { value: 'in_progress', label: STATUS_LABEL.in_progress },
    { value: 'resolved', label: STATUS_LABEL.resolved },
    { value: 'closed', label: STATUS_LABEL.closed },
  ];

  const exportCsv = () => {
    const headers = ['Ticket ID', 'วันที่แจ้ง', 'ผู้แจ้ง', 'อาคาร', 'พื้นที่', 'ประเภท', 'สถานะ', 'เจ้าหน้าที่'];
    const rows = tickets.map(t => [t.id, t.createdAt, t.reporter, t.building, t.area, t.type, t.statusLabel, t.assignee || '']);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'netcheck-tickets.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">จัดการรายการแจ้งปัญหา</h1>
          <p className="text-sm text-gray-500">{tickets.length} รายการ</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download size={15} /> Export
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="ค้นหา Ticket ID, ผู้แจ้ง, อาคาร..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="flex items-center gap-1 text-xs text-gray-500"><Filter size={13} /> กรอง:</span>
          <select value={filterBuilding} onChange={e => { setFilterBuilding(e.target.value); setPage(1); }} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400">
            <option value="">ทุกอาคาร</option>
            {(meta?.buildings || []).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400">
            <option value="">ทุกประเภท</option>
            {(meta?.issueTypes || []).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400">
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Ticket ID', 'วันที่แจ้ง', 'ผู้แจ้ง', 'อาคาร', 'พื้นที่', 'ประเภท', 'สถานะ', 'เจ้าหน้าที่', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">กำลังโหลด...</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">ไม่พบรายการ</td></tr>
              ) : paged.map((t, i) => (
                <tr key={t.id} className={`hover:bg-blue-50/30 transition-colors ${i < paged.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <td className="px-4 py-3.5">
                    <button onClick={() => onNav('admin-issue-detail', t.id)} className="font-mono text-xs font-bold text-blue-700 hover:underline">#{t.id}</button>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{t.createdAt.split(' ')[0]}</td>
                  <td className="px-4 py-3.5 text-gray-800 whitespace-nowrap">{t.reporter}</td>
                  <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{t.building}</td>
                  <td className="px-4 py-3.5 text-gray-600">{t.area}</td>
                  <td className="px-4 py-3.5 text-gray-700 whitespace-nowrap">{t.type}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">{t.assignee || '—'}</td>
                  <td className="px-4 py-3.5 relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenu === t.id && (
                      <div className="absolute right-4 top-10 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                        <button
                          onClick={() => { onNav('admin-issue-detail', t.id); setOpenMenu(null); }}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          ดูรายละเอียด / จัดการ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            แสดง {tickets.length === 0 ? 0 : Math.min((page - 1) * perPage + 1, tickets.length)}–{Math.min(page * perPage, tickets.length)} จาก {tickets.length} รายการ
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
