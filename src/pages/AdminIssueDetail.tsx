import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { TicketStatus, STATUS_LABEL } from '../data/mock';
import { api, Ticket, Meta } from '../lib/api';

interface Props { onNav: (p: string) => void; ticketId: string; }

const STATUS_OPTIONS: TicketStatus[] = ['pending', 'in_progress', 'resolved', 'closed'];

export default function AdminIssueDetail({ onNav, ticketId }: Props) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [status, setStatus] = useState<TicketStatus>('pending');
  const [assignee, setAssignee] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.getTicket(ticketId).then(d => {
      setTicket(d.ticket);
      setStatus(d.ticket.status);
      setAssignee(d.ticket.assignee || '');
      setNote(d.ticket.staffNote || '');
    }).catch(e => setError(e.message));
  };

  useEffect(() => { load(); api.meta().then(setMeta); }, [ticketId]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
          await api.updateTicket(ticketId, { status, assignee: assignee || undefined, staffNote: note || undefined });
      const d = await api.getTicket(ticketId);
      setTicket(d.ticket);
      setStatus(d.ticket.status);
      setAssignee(d.ticket.assignee || '');
      setNote(d.ticket.staffNote || '');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  if (error && !ticket) {
    return (
      <div className="p-6">
        <button onClick={() => onNav('admin-issues')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={15} /> กลับรายการปัญหา
        </button>
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">{error}</div>
      </div>
    );
  }

  if (!ticket) return <div className="p-6 text-sm text-gray-400">กำลังโหลด...</div>;

  return (
    <div className="p-6">
      <button onClick={() => onNav('admin-issues')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={15} /> กลับรายการปัญหา
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">รายละเอียด Ticket #{ticket.id}</h1>
        <StatusBadge status={ticket.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Issue Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Reporter */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">ข้อมูลผู้แจ้ง</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                {ticket.reporter.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">{ticket.reporter}</div>
                <div className="text-xs text-gray-500">นักศึกษา / ผู้ใช้งาน</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-gray-400 mb-0.5">Email</div><div className="font-medium text-gray-800">{ticket.reporterEmail}</div></div>
              <div><div className="text-xs text-gray-400 mb-0.5">โทรศัพท์</div><div className="font-medium text-gray-800">{ticket.reporterPhone}</div></div>
            </div>
          </div>

          {/* Issue Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">ข้อมูลปัญหา</h2>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              {[
                { label: 'วันที่แจ้ง', value: ticket.createdAt },
                { label: 'อาคาร', value: ticket.building },
                { label: 'พื้นที่/ห้อง', value: ticket.area },
                { label: 'ประเภทปัญหา', value: ticket.type },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                  <div className="font-medium text-gray-900">{value}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">รายละเอียด</div>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{ticket.description}</p>
            </div>
            {ticket.image && (
              <div className="mt-4">
                <div className="text-xs text-gray-400 mb-1">รูปภาพแนบ</div>
                <img src={ticket.image} alt="attachment" className="max-h-56 rounded-xl border border-gray-200" />
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-5">ประวัติการดำเนินงาน</h2>
            <div className="space-y-0">
              {ticket.timeline.map((step, i) => {
                const isLast = i === ticket.timeline.length - 1;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={14} className="text-blue-600" />
                      </div>
                      {!isLast && <div className="w-0.5 h-8 bg-blue-100 my-1" />}
                    </div>
                    <div className="pb-5">
                      <div className="text-sm font-semibold text-gray-900">{step.label}</div>
                      <div className="text-xs text-gray-500">{step.date}</div>
                      {step.note && <div className="text-xs text-gray-600 mt-1">{step.note}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Status Update */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">อัปเดตสถานะ</h2>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">สถานะปัจจุบัน</div>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">เปลี่ยนสถานะ</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TicketStatus)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">เจ้าหน้าที่ผู้รับผิดชอบ</label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">ยังไม่ได้มอบหมาย</option>
                {(meta?.staff || []).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">รายละเอียดการแก้ไข</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={4}
                placeholder="บันทึกรายละเอียดการดำเนินงาน..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${
                saved ? 'bg-green-600 text-white' : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              {saving ? 'กำลังบันทึก...' : saved ? <><CheckCircle2 size={16} /> บันทึกแล้ว</> : <><Save size={15} /> บันทึกการดำเนินงาน</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
