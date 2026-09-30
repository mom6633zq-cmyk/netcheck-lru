import { useState } from 'react';
import { ArrowLeft, Wifi, Download, Upload, Activity, RotateCcw } from 'lucide-react';
import { api, apiUrl } from '../lib/api';

interface Props { onNav: (p: string) => void; }

type Phase = 'idle' | 'ping' | 'download' | 'upload' | 'done';

async function measurePing(): Promise<number> {
  const samples: number[] = [];
  for (let i = 0; i < 5; i++) {
    const start = performance.now();
    await fetch(apiUrl(`/nettest/ping.php?_=${Date.now()}-${i}`), { cache: 'no-store', credentials: 'include' });
    samples.push(performance.now() - start);
  }
  samples.shift(); // discard first (connection warm-up)
  return samples.reduce((a, b) => a + b, 0) / samples.length;
}

async function measureDownload(): Promise<number> {
  const bytes = 4_000_000;
  const start = performance.now();
  const res = await fetch(apiUrl(`/nettest/download.php?bytes=${bytes}&_=${Date.now()}`), { cache: 'no-store', credentials: 'include' });
  await res.arrayBuffer();
  const seconds = (performance.now() - start) / 1000;
  return (bytes * 8) / seconds / 1_000_000; // Mbps
}

async function measureUpload(): Promise<number> {
  const bytes = 2_000_000;
  const payload = new Uint8Array(bytes);
  crypto.getRandomValues(payload.subarray(0, Math.min(65536, bytes))); // seed some randomness cheaply
  const start = performance.now();
  await fetch(apiUrl('/nettest/upload.php'), { method: 'POST', body: payload, cache: 'no-store', credentials: 'include' });
  const seconds = (performance.now() - start) / 1000;
  return (bytes * 8) / seconds / 1_000_000; // Mbps
}

export default function NetworkTestPage({ onNav }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [ping, setPing] = useState<number | null>(null);
  const [download, setDownload] = useState<number | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  const [error, setError] = useState('');

  const runTest = async () => {
    setError('');
    setPing(null); setDownload(null); setUpload(null);
    try {
      setPhase('ping');
      const p = await measurePing();
      setPing(p);

      setPhase('download');
      const d = await measureDownload();
      setDownload(d);

      setPhase('upload');
      const u = await measureUpload();
      setUpload(u);

      setPhase('done');
      await api.nettestSaveResult({ downloadMbps: d, uploadMbps: u, pingMs: p });
    } catch (e: any) {
      setError(e.message || 'ทดสอบเครือข่ายไม่สำเร็จ กรุณาลองใหม่');
      setPhase('idle');
    }
  };

  const phaseLabel: Record<Phase, string> = {
    idle: '', ping: 'กำลังวัดค่า Ping...', download: 'กำลังวัด Download...', upload: 'กำลังวัด Upload...', done: 'ทดสอบเสร็จสิ้น',
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => onNav('dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={15} /> กลับหน้าหลัก
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ตรวจสอบคุณภาพเครือข่าย</h1>
        <p className="text-gray-500 text-sm mt-1">ตรวจสอบความเร็วและคุณภาพการเชื่อมต่ออินเทอร์เน็ต</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-2 mb-5">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-gray-700">เชื่อมต่ออินเทอร์เน็ตปกติ</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center mb-5">
        {phase === 'idle' && (
          <>
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Wifi size={36} className="text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900 mb-1">พร้อมตรวจสอบ</h2>
            <p className="text-sm text-gray-500 mb-6">กดปุ่มด้านล่างเพื่อเริ่มทดสอบความเร็วอินเทอร์เน็ต</p>
            <button onClick={runTest} className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors">
              เริ่มตรวจสอบเครือข่าย
            </button>
          </>
        )}

        {phase !== 'idle' && phase !== 'done' && (
          <>
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4 animate-pulse">
              <Activity size={36} className="text-blue-600" />
            </div>
            <h2 className="font-semibold text-gray-900 mb-1">{phaseLabel[phase]}</h2>
            <p className="text-sm text-gray-500">กรุณารอสักครู่ อย่าปิดหน้านี้</p>
          </>
        )}

        {phase === 'done' && (
          <>
            <div className="grid grid-cols-3 gap-4 w-full mb-5">
              <div className="bg-blue-50 rounded-xl p-4">
                <Download size={18} className="text-blue-600 mx-auto mb-1.5" />
                <div className="text-lg font-bold text-gray-900">{download?.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Mbps ↓</div>
              </div>
              <div className="bg-sky-50 rounded-xl p-4">
                <Upload size={18} className="text-sky-600 mx-auto mb-1.5" />
                <div className="text-lg font-bold text-gray-900">{upload?.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Mbps ↑</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <Activity size={18} className="text-purple-600 mx-auto mb-1.5" />
                <div className="text-lg font-bold text-gray-900">{Math.round(ping || 0)}</div>
                <div className="text-xs text-gray-500">ms Ping</div>
              </div>
            </div>
            <button onClick={runTest} className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              <RotateCcw size={15} /> ทดสอบอีกครั้ง
            </button>
          </>
        )}

        {error && <p className="mt-4 text-xs text-red-600">{error}</p>}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 space-y-1.5">
        <div className="flex justify-between"><span>วิธีวัดผล</span><span className="text-gray-700 font-medium">วัดจริงกับเซิร์ฟเวอร์ของระบบ</span></div>
        <div className="flex justify-between"><span>Ping</span><span className="text-gray-700 font-medium">เฉลี่ยจาก 4 รอบ</span></div>
        <div className="flex justify-between"><span>Download / Upload</span><span className="text-gray-700 font-medium">ถ่ายโอนข้อมูลจริง 2-4MB</span></div>
      </div>
    </div>
  );
}
