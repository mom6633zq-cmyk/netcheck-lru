import { useState } from 'react';
import { Eye, EyeOff, Wifi, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onLoggedIn: (role: 'user' | 'admin') => void;
}

export default function LoginPage({ onLoggedIn }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // register-only fields
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'กรุณากรอก Email';
    if (!password) errs.password = 'กรุณากรอกรหัสผ่าน';
    else if (password.length < 4) errs.password = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร';
    if (mode === 'register' && !name) errs.name = 'กรุณากรอกชื่อ-สกุล';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setFormError('');
    setLoading(true);
    try {
      const user = mode === 'login'
        ? await login(email, password)
        : await register({ name, studentId, email, phone, password });
      onLoggedIn(user.role);
    } catch (err: any) {
      setFormError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-blue-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-sky-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wifi size={24} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white leading-tight">NetCheck LRU</div>
              <div className="text-xs text-blue-300">มหาวิทยาลัยราชภัฏเลย</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white leading-snug mb-4">
            ระบบตรวจสอบ<br />คุณภาพเครือข่าย
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            ตรวจสอบและแจ้งปัญหาอินเทอร์เน็ตภายในมหาวิทยาลัยราชภัฏเลย เพื่อการแก้ไขที่รวดเร็วและมีประสิทธิภาพ
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: 'ปัญหาที่แก้ไขแล้ว', value: '69+' },
            { label: 'เวลาเฉลี่ย', value: '12 ชม.' },
            { label: 'ผู้ใช้งาน', value: '500+' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-blue-300 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
              <Wifi size={18} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">NetCheck LRU</div>
              <div className="text-xs text-gray-500">มหาวิทยาลัยราชภัฏเลย</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {mode === 'login' ? 'เข้าสู่ระบบเพื่อใช้งานระบบเครือข่าย' : 'สร้างบัญชีผู้ใช้ใหม่สำหรับนักศึกษา'}
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ-สกุล</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="เช่น นายสมชาย ใจดี"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">รหัสนักศึกษา</label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="6501xxxxxx"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">เบอร์โทร</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08x-xxx-xxxx"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอก Email"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                    errors.email
                      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน"
                    className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm outline-none transition-all ${
                      errors.password
                        ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-600">จดจำฉัน</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {mode === 'login' ? 'กำลังเข้าสู่ระบบ...' : 'กำลังสมัครสมาชิก...'}
                  </>
                ) : (mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              {mode === 'login' ? (
                <>ยังไม่มีบัญชี? <button onClick={() => { setMode('register'); setFormError(''); setErrors({}); }} className="text-blue-600 font-medium hover:underline">สมัครสมาชิก</button></>
              ) : (
                <>มีบัญชีอยู่แล้ว? <button onClick={() => { setMode('login'); setFormError(''); setErrors({}); }} className="text-blue-600 font-medium hover:underline">เข้าสู่ระบบ</button></>
              )}
            </div>

            {mode === 'login' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
                  <Shield size={12} /> ทดสอบ Admin: admin@lru.ac.th / admin123
                </p>
                <p className="text-xs text-blue-700 mt-1">ทดสอบผู้ใช้: somchai@lru.ac.th / 123456</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
