import { useState } from 'react';
import { User, Mail, Phone, Hash, Edit2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', studentId: user?.studentId || '', phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.updateMe(form);
      await refreshUser();
      setEditing(false);
    } catch (e: any) {
      setError(e.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwSaving(true);
    setPwError('');
    try {
      await api.changePassword(pwForm.current, pwForm.next);
      setPwSuccess(true);
      setTimeout(() => { setShowPwModal(false); setPwSuccess(false); setPwForm({ current: '', next: '' }); }, 1200);
    } catch (e: any) {
      setPwError(e.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ');
    } finally {
      setPwSaving(false);
    }
  };

  const fields = [
    { icon: User, label: 'ชื่อ-สกุล', key: 'name' as const, value: editing ? form.name : user.name },
    { icon: Hash, label: 'รหัสนักศึกษา', key: 'studentId' as const, value: editing ? form.studentId : (user.studentId || '—') },
    { icon: Mail, label: 'Email', key: null, value: user.email },
    { icon: Phone, label: 'เบอร์โทรศัพท์', key: 'phone' as const, value: editing ? form.phone : (user.phone || '—') },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">โปรไฟล์</h1>
        <p className="text-gray-500 text-sm mt-1">ข้อมูลส่วนตัวของคุณ</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">{user.name.charAt(0)}</div>
          <div>
            <div className="font-bold text-gray-900 text-lg">{user.name}</div>
            <div className="text-sm text-gray-500">{user.role === 'admin' ? 'เจ้าหน้าที่ดูแลระบบ' : 'นักศึกษา'} {user.faculty ? `· ${user.faculty}` : ''}</div>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">{error}</div>}

        <div className="space-y-4">
          {fields.map(({ icon: Icon, label, key, value }) => (
            <div key={label}>
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                <Icon size={12} /> {label}
              </label>
              {editing && key ? (
                <input
                  type="text"
                  value={value}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              ) : (
                <div className="text-sm font-medium text-gray-900 px-3.5 py-2.5 bg-gray-50 rounded-lg">{value}</div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          {editing ? (
            <>
              <button onClick={() => { setEditing(false); setForm({ name: user.name, studentId: user.studentId || '', phone: user.phone || '' }); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">ยกเลิก</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold disabled:opacity-60">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold">
                <Edit2 size={14} /> แก้ไขข้อมูล
              </button>
              <button onClick={() => setShowPwModal(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Lock size={14} /> เปลี่ยนรหัสผ่าน
              </button>
            </>
          )}
        </div>
      </div>

      {showPwModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">เปลี่ยนรหัสผ่าน</h3>
            {pwSuccess ? (
              <p className="text-sm text-green-600 mb-4">เปลี่ยนรหัสผ่านสำเร็จ</p>
            ) : (
              <div className="space-y-3 mb-4">
                <input type="password" placeholder="รหัสผ่านปัจจุบัน" value={pwForm.current}
                  onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                <input type="password" placeholder="รหัสผ่านใหม่" value={pwForm.next}
                  onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                {pwError && <p className="text-xs text-red-600">{pwError}</p>}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowPwModal(false); setPwError(''); setPwForm({ current: '', next: '' }); }} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">ปิด</button>
              {!pwSuccess && (
                <button onClick={handleChangePassword} disabled={pwSaving} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold disabled:opacity-60">
                  {pwSaving ? 'กำลังบันทึก...' : 'ยืนยัน'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
