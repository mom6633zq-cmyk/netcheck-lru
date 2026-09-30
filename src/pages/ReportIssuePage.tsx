import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X, ImageIcon } from 'lucide-react';
import { api, Meta } from '../lib/api';

interface Props { onNav: (p: string) => void; }

// ✅ ย้าย Helper function และ Component ย่อย ออกมาข้างนอกเพื่อป้องกันการหลุดโฟกัส
const inputCls = (err?: string) =>
  `w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all ${err ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`;

const Field = ({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
    {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
  </div>
);

export default function ReportIssuePage({ onNav }: Props) {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [form, setForm] = useState({ building: '', area: '', type: '', description: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { api.meta().then(setMeta); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.building) e.building = 'กรุณาเลือกอาคาร';
    if (!form.area) e.area = 'กรุณาระบุพื้นที่/ห้อง';
    if (!form.type) e.type = 'กรุณาเลือกประเภทปัญหา';
    if (!form.description) e.description = 'กรุณากรอกรายละเอียดปัญหา';
    if (!confirmed) e.confirmed = 'กรุณายืนยันความถูกต้องของข้อมูล';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setShowModal(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.createTicket({ ...form, image });
      setShowModal(false);
      onNav('report-success');
    } catch (err: any) {
      setSubmitError(err.message || 'ส่งเรื่องไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => onNav('dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={15} /> กลับหน้าหลัก
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">แจ้งปัญหาอินเทอร์เน็ต</h1>
        <p className="text-gray-500 text-sm mt-1">กรอกข้อมูลเพื่อแจ้งปัญหาให้เจ้าหน้าที่ดำเนินการ</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="อาคาร *" err={errors.building}>
            <select value={form.building} onChange={e => set('building', e.target.value)} className={inputCls(errors.building)}>
              <option value="">-- เลือกอาคาร --</option>
              {(meta?.buildings || []).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>

          <Field label="พื้นที่ / ห้อง *" err={errors.area}>
            <input
              type="text"
              value={form.area}
              onChange={e => set('area', e.target.value)}
              placeholder="เช่น ห้อง 101 ชั้น 2"
              className={inputCls(errors.area)}
            />
          </Field>
        </div>

        <Field label="ประเภทปัญหา *" err={errors.type}>
          <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls(errors.type)}>
            <option value="">-- เลือกประเภทปัญหา --</option>
            {(meta?.issueTypes || []).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="รายละเอียดปัญหา *" err={errors.description}>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="อธิบายปัญหาที่พบโดยรายละเอียด..."
            rows={4}
            className={`${inputCls(errors.description)} resize-none`}
          />
        </Field>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">แนบรูปภาพ (ไม่บังคับ)</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {image ? (
            <div className="relative inline-block">
              <img src={image} alt="preview" className="h-32 w-48 object-cover rounded-xl border border-gray-200" />
              <button
                type="button"
                onClick={() => { setImage(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <ImageIcon size={28} />
              <span className="text-sm">ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์</span>
              <span className="text-xs">PNG, JPG ไม่เกิน 5MB</span>
            </button>
          )}
        </div>

        <div>
          <label className={`flex items-start gap-2.5 cursor-pointer ${errors.confirmed ? 'text-red-600' : ''}`}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-blue-600"
            />
            <span className="text-sm text-gray-700">
              ข้าพเจ้าขอรับรองว่าข้อมูลที่แจ้งมีความถูกต้องและเป็นความจริง
            </span>
          </label>
          {errors.confirmed && <p className="mt-1 text-xs text-red-600 ml-6">{errors.confirmed}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors"
        >
          ส่งเรื่องแจ้งปัญหา
        </button>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการแจ้งปัญหา?</h3>
            <p className="text-sm text-gray-600 mb-4">โปรดตรวจสอบข้อมูลก่อนส่ง</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 mb-5">
              <div className="flex justify-between"><span className="text-gray-500">อาคาร</span><span className="font-medium">{form.building}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">พื้นที่</span><span className="font-medium">{form.area}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">ประเภท</span><span className="font-medium">{form.type}</span></div>
            </div>
            {submitError && <p className="text-xs text-red-600 mb-3">{submitError}</p>}
            <div className="flex gap-3">
              <button disabled={submitting} onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                ยกเลิก
              </button>
              <button disabled={submitting} onClick={confirmSubmit} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold disabled:opacity-60">
                {submitting ? 'กำลังส่ง...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}