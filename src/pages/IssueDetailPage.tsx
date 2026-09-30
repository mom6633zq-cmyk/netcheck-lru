import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { api, Ticket } from '../lib/api';

interface Props { onNav: (p: string) => void; ticketId: string; }

export default function IssueDetailPage({ onNav, ticketId }: Props) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setTicket(null);
    setError('');
    api.getTicket(ticketId).then(d => setTicket(d.ticket)).catch(e => setError(e.message));
  }, [ticketId]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => onNav('issue-history')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft size={15} /> กลับไปประวัติ
        </button>
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">{error}</div>
      </div>
    );
  }

  if (!ticket) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">กำลังโหลด...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => onNav('issue-history')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={15} /> กลับไปประวัติ
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">รายละเอียดการแจ้งปัญหา</h1>
          <span className="font-mono text-sm text-blue-700">#{ticket.id}</span>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      {/* Ticket Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">ข้อมูลปัญหา</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
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
        <div className="mt-4">
          <div className="text-xs text-gray-400 mb-1">รายละเอียด</div>
          <p className="text-sm text-gray-700 leading-relaxed">{ticket.description}</p>
        </div>
        {ticket.image && (
          <div className="mt-4">
            <div className="text-xs text-gray-400 mb-1">รูปภาพแนบ</div>
            <img src={ticket.image} alt="attachment" className="max-h-56 rounded-xl border border-gray-200" />
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">ความคืบหน้า</h2>
        <div className="space-y-0">
          {ticket.timeline.map((step, i) => {
            const isLast = i === ticket.timeline.length - 1;
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                    <CheckCircle2 size={16} className="text-blue-600" />
                  </div>
                  {!isLast && <div className="w-0.5 h-8 bg-blue-100 my-1" />}
                </div>
                <div className="pb-6">
                  <div className="text-sm font-semibold text-gray-900">{step.label}</div>
                  <div className="text-xs text-gray-500">{step.date}</div>
                  {step.note && <div className="text-xs text-gray-600 mt-1 bg-gray-50 rounded-lg px-3 py-1.5">{step.note}</div>}
                </div>
              </div>
            );
          })}
          {/* Pending future steps */}
          {['แก้ไขแล้ว', 'ปิดงาน'].filter(s => !ticket.timeline.some(t => t.label === s)).map((s, i, arr) => (
            <div key={s} className="flex gap-4 opacity-40">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Circle size={16} className="text-gray-300" />
                </div>
                {i < arr.length - 1 && <div className="w-0.5 h-8 bg-gray-100 my-1" />}
              </div>
              <div className="pb-6">
                <div className="text-sm font-medium text-gray-400">{s}</div>
                <div className="text-xs text-gray-400">รอดำเนินการ</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Note */}
      {ticket.staffNote && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
          <h2 className="text-sm font-semibold text-blue-700 mb-2">รายละเอียดจากเจ้าหน้าที่</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{ticket.staffNote}</p>
          {ticket.assignee && <p className="text-xs text-gray-500 mt-2">โดย: {ticket.assignee} · {ticket.updatedAt}</p>}
        </div>
      )}
    </div>
  );
}
