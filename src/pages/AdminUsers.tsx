import { useEffect, useState } from 'react';
import { Users, User, ShieldCheck, Search, Plus, MoreVertical, X } from 'lucide-react';
import { api, AdminUser } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Modal =
  | { kind: 'view'; user: AdminUser }
  | { kind: 'form'; user: AdminUser | null }
  | { kind: 'reset'; user: AdminUser }
  | null;

const inputCls = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [menuId, setMenuId] = useState<number | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', studentId: '', email: '', faculty: '', phone: '', role: 'user', password: '' });
  const [newPw, setNewPw] = useState('');

  const load = () => api.listUsers().then(d => setUsers(d.users)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const okSearch = !q || [u.name, u.email, u.studentId || ''].some(v => v.toLowerCase().includes(q));
    return okSearch && (!roleFilter || u.role === roleFilter);
  });

  const openForm = (u: AdminUser | null) => {
    setError(''); setMenuId(null);
    setForm(u
      ? { name: u.name, studentId: u.studentId || '', email: u.email, faculty: u.faculty || '', phone: u.phone || '', role: u.role, password: '' }
      : { name: '', studentId: '', email: '', faculty: '', phone: '', role: 'user', password: '' });
    setModal({ kind: 'form', user: u });
  };

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true); setError('');
    try { await fn(); await load(); setModal(null); setNewPw(''); }
    catch (e: any) { setError(e.message || 'เกิดข้อผิดพลาด'); }
    finally { setBusy(false); }
  };

  const submitForm = () => {
    const editing = modal?.kind === 'form' ? modal.user : null;
    return run(() => editing
      ? api.updateUser(editing.id, { name: form.name, studentId: form.studentId, phone: form.phone, faculty: form.faculty, role: form.role })
      : api.createUser(form));
  };

  const toggleSuspend = (u: AdminUser) => {
    setMenuId(null);
    return run(() => api.updateUser(u.id, { status: u.status === 'active' ? 'suspended' : 'active' }));
  };

  const remove = (u: AdminUser) => {
    setMenuId(null);
    if (!window.confirm(`ลบผู้ใช้ "${u.name}" ?\nรายการแจ้งปัญหาของผู้ใช้นี้จะถูกลบไปด้วย`)) return;
    return run(() => api.deleteUser(u.id));
  };

  const total = users.length;
  const staffCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
          <p className="text-sm text-gray-500">{total} บัญชีผู้ใช้</p>
        </div>
        <button onClick={() => openForm(null)} className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold">
          <Plus size={15} /> เพิ่มผู้ใช้งาน
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'ผู้ใช้งานทั้งหมด', value: total, icon: Users, color: 'text-purple-700', bg: 'bg-purple-50' },
          { label: 'นักศึกษา / บุคลากร', value: total - staffCount, icon: User, color: 'text-gray-700', bg: 'bg-gray-100' },
          { label: 'เจ้าหน้าที่ IT', value: staffCount, icon: ShieldCheck, color: 'text-green-700', bg: 'bg-green-50' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}><c.icon size={18} className={c.color} /></div>
            <div>
              <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
              <div className="text-xs text-gray-500">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาชื่อ, Email, รหัส..." className={`${inputCls} pl-9`} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500">
          <option value="">ทุกประเภท</option>
          <option value="user">ผู้ใช้</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['ชื่อ-สกุล', 'รหัส', 'EMAIL', 'คณะ / ส่วนงาน', 'สิทธิ์', 'แจ้งปัญหา', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">กำลังโหลด...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">ไม่พบผู้ใช้งาน</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id} className={`hover:bg-blue-50/30 ${i < filtered.length - 1 ? 'border-b border-gray-100' : ''} ${u.status === 'suspended' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center">{u.name.replace(/^(นาย|นางสาว|นาง)/, '').charAt(0)}</div>
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        {u.status === 'suspended' && <div className="text-[10px] text-red-500">ถูกระงับ</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-gray-600">{u.studentId || '—'}</td>
                  <td className="px-4 py-3.5 text-gray-700">{u.email}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-600">{u.faculty || '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role === 'admin' ? <><ShieldCheck size={11} /> Admin</> : <><User size={11} /> ผู้ใช้</>}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-800">{u.problemCount}</td>
                  <td className="px-4 py-3.5 relative">
                    <button onClick={() => setMenuId(menuId === u.id ? null : u.id)} className="p-1 rounded hover:bg-gray-100 text-gray-400"><MoreVertical size={16} /></button>
                    {menuId === u.id && (
                      <div className="absolute right-4 top-11 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 text-xs">
                        <button onClick={() => { setMenuId(null); setModal({ kind: 'view', user: u }); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">ดูข้อมูล</button>
                        <button onClick={() => openForm(u)} className="w-full text-left px-4 py-2 hover:bg-gray-50">แก้ไข</button>
                        <button onClick={() => { setMenuId(null); setError(''); setNewPw(''); setModal({ kind: 'reset', user: u }); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">รีเซ็ตรหัสผ่าน</button>
                        {u.id !== me?.id && (
                          <>
                            <button onClick={() => toggleSuspend(u)} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-amber-600">{u.status === 'active' ? 'ระงับบัญชี' : 'เปิดใช้งานบัญชี'}</button>
                            <button onClick={() => remove(u)} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600">ลบผู้ใช้</button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {modal.kind === 'view' ? 'ข้อมูลผู้ใช้งาน' : modal.kind === 'reset' ? 'รีเซ็ตรหัสผ่าน' : modal.user ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งาน'}
              </h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {modal.kind === 'view' && (
              <div className="space-y-2 text-sm">
                {[['ชื่อ-สกุล', modal.user.name], ['รหัส', modal.user.studentId || '—'], ['Email', modal.user.email], ['เบอร์โทร', modal.user.phone || '—'],
                  ['คณะ / ส่วนงาน', modal.user.faculty || '—'], ['สิทธิ์', modal.user.role === 'admin' ? 'Admin' : 'ผู้ใช้'],
                  ['สถานะบัญชี', modal.user.status === 'active' ? 'ใช้งานปกติ' : 'ถูกระงับ'], ['จำนวนที่แจ้งปัญหา', String(modal.user.problemCount)]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-gray-50"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-900 text-right">{v}</span></div>
                ))}
              </div>
            )}

            {modal.kind === 'form' && (
              <div className="space-y-3">
                <input className={inputCls} placeholder="ชื่อ-สกุล *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="รหัส" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} />
                  <input className={inputCls} placeholder="เบอร์โทร" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <input className={`${inputCls} ${modal.user ? 'bg-gray-50 text-gray-500' : ''}`} placeholder="Email *" value={form.email} disabled={!!modal.user} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <input className={inputCls} placeholder="คณะ / ส่วนงาน" value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))} />
                <select className={inputCls} value={form.role} disabled={modal.user?.id === me?.id} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="user">ผู้ใช้ (นักศึกษา / บุคลากร)</option>
                  <option value="admin">Admin (เจ้าหน้าที่ IT)</option>
                </select>
                {!modal.user && <input type="password" className={inputCls} placeholder="รหัสผ่านเริ่มต้น * (อย่างน้อย 4 ตัว)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />}
              </div>
            )}

            {modal.kind === 'reset' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">ตั้งรหัสผ่านใหม่ให้ <span className="font-semibold">{modal.user.name}</span></p>
                <input type="password" className={inputCls} placeholder="รหัสผ่านใหม่ (อย่างน้อย 4 ตัว)" value={newPw} onChange={e => setNewPw(e.target.value)} />
              </div>
            )}

            {error && <p className="text-xs text-red-600 mt-3">{error}</p>}

            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">{modal.kind === 'view' ? 'ปิด' : 'ยกเลิก'}</button>
              {modal.kind === 'form' && <button disabled={busy} onClick={submitForm} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold disabled:opacity-60">{busy ? 'กำลังบันทึก...' : 'บันทึก'}</button>}
              {modal.kind === 'reset' && <button disabled={busy} onClick={() => run(() => api.updateUser(modal.user.id, { newPassword: newPw }))} className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold disabled:opacity-60">{busy ? 'กำลังบันทึก...' : 'ยืนยัน'}</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
