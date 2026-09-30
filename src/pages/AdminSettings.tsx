import { useEffect, useState } from 'react';
import { Wifi, Bell, Ticket, Mail, Save, CheckCircle2 } from 'lucide-react';
import { api, SystemSettings } from '../lib/api';

const inputCls = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const labelCls = 'block text-xs font-medium text-gray-600 mb-1.5';

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-blue-600' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

function Card({ icon: Icon, title, children }: { icon: typeof Wifi; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Icon size={15} className="text-blue-600" />
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function AdminSettings() {
  const [s, setS] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [mailNote, setMailNote] = useState(false);

  useEffect(() => { api.getSettings().then(d => setS(d.settings)).catch(e => setError(e.message)); }, []);

  if (!s) return <div className="p-6 text-sm text-gray-400">{error || 'กำลังโหลด...'}</div>;

  const set = (k: string, v: string) => setS(prev => ({ ...prev!, [k]: v }));
  const bool = (k: string) => s[k] === '1';

  const save = async () => {
    setSaving(true); setError('');
    try {
      const d = await api.saveSettings(s);
      setS(d.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) { setError(e.message || 'บันทึกไม่สำเร็จ'); }
    finally { setSaving(false); }
  };

  const Select = ({ k, options }: { k: string; options: { v: string; l: string }[] }) => (
    <select value={s[k]} onChange={e => set(k, e.target.value)} className={inputCls}>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
          <p className="text-sm text-gray-500">กำหนดค่าการทำงานของระบบ</p>
        </div>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 ${saved ? 'bg-green-600' : 'bg-blue-700 hover:bg-blue-800'}`}>
          {saved ? <><CheckCircle2 size={15} /> บันทึกแล้ว</> : <><Save size={15} /> {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</>}
        </button>
      </div>
      {error && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card icon={Wifi} title="ข้อมูลระบบ">
          <div><label className={labelCls}>ชื่อระบบ</label>
            <input className={inputCls} value={s.system_name} onChange={e => set('system_name', e.target.value)} /></div>
          <div><label className={labelCls}>Email ผู้ดูแลระบบ</label>
            <input className={inputCls} value={s.admin_email} onChange={e => set('admin_email', e.target.value)} /></div>
          <div><label className={labelCls}>ตรวจสอบเครือข่ายอัตโนมัติทุก (นาที)</label>
            <Select k="auto_check_minutes" options={[{ v: '15', l: '15 นาที' }, { v: '30', l: '30 นาที' }, { v: '60', l: '60 นาที' }, { v: '120', l: '120 นาที' }]} /></div>
        </Card>

        <Card icon={Bell} title="การแจ้งเตือน">
          <div className="flex items-center justify-between gap-4">
            <div><div className="text-sm font-medium text-gray-800">แจ้งเตือนทาง Email</div>
              <div className="text-xs text-gray-500">ส่งอีเมลเมื่อมีการแจ้งปัญหาใหม่</div></div>
            <Toggle on={bool('notify_email')} onChange={v => set('notify_email', v ? '1' : '0')} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div><div className="text-sm font-medium text-gray-800">แจ้งเตือนทาง LINE Notify</div>
              <div className="text-xs text-gray-500">ส่งข้อความ LINE เมื่อมีปัญหาด่วน</div></div>
            <Toggle on={bool('notify_line')} onChange={v => set('notify_line', v ? '1' : '0')} />
          </div>
        </Card>

        <Card icon={Ticket} title="การจัดการ Ticket">
          <div className="flex items-center justify-between gap-4">
            <div><div className="text-sm font-medium text-gray-800">มอบหมายงานอัตโนมัติ</div>
              <div className="text-xs text-gray-500">กระจาย Ticket ให้เจ้าหน้าที่อัตโนมัติ</div></div>
            <Toggle on={bool('auto_assign')} onChange={v => set('auto_assign', v ? '1' : '0')} />
          </div>
          <div><label className={labelCls}>SLA — เวลาตอบสนองสูงสุด (ชั่วโมง)</label>
            <Select k="sla_hours" options={[{ v: '8', l: '8 ชั่วโมง' }, { v: '12', l: '12 ชั่วโมง' }, { v: '24', l: '24 ชั่วโมง' }, { v: '48', l: '48 ชั่วโมง' }, { v: '72', l: '72 ชั่วโมง' }]} /></div>
          <div><label className={labelCls}>ปิด Ticket อัตโนมัติหลังแก้ไขแล้ว (วัน)</label>
            <Select k="auto_close_days" options={[{ v: '3', l: '3 วัน' }, { v: '7', l: '7 วัน' }, { v: '14', l: '14 วัน' }, { v: '30', l: '30 วัน' }]} /></div>
        </Card>

        <Card icon={Mail} title="อีเมลแจ้งเตือน">
          <div><label className={labelCls}>SMTP Server</label>
            <input className={inputCls} value={s.smtp_host} onChange={e => set('smtp_host', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Port</label>
              <input className={inputCls} value={s.smtp_port} onChange={e => set('smtp_port', e.target.value)} /></div>
            <div><label className={labelCls}>Security</label>
              <Select k="smtp_security" options={[{ v: 'TLS', l: 'TLS' }, { v: 'SSL', l: 'SSL' }, { v: 'None', l: 'ไม่เข้ารหัส' }]} /></div>
          </div>
          <div><label className={labelCls}>Email ผู้ส่ง</label>
            <input className={inputCls} value={s.mail_from} onChange={e => set('mail_from', e.target.value)} /></div>
          <button type="button" onClick={() => setMailNote(true)} className="text-xs text-blue-600 hover:underline">ทดสอบส่งอีเมล →</button>
          {mailNote && <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2.5">ขณะนี้ระบบบันทึกค่า SMTP ไว้เท่านั้น ยังไม่ได้เชื่อมต่อส่งอีเมลจริง</p>}
        </Card>
      </div>
    </div>
  );
}
