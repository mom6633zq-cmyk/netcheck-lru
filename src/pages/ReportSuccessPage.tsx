import { CheckCircle2, ArrowRight, Home } from 'lucide-react';

interface Props { onNav: (p: string, id?: string) => void; }

export default function ReportSuccessPage({ onNav }: Props) {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">แจ้งปัญหาสำเร็จ</h1>
      <p className="text-gray-500 text-sm mb-8">เจ้าหน้าที่ได้รับข้อมูลของคุณแล้ว และจะดำเนินการโดยเร็วที่สุด</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 text-left space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Ticket ID</span>
          <span className="font-mono font-bold text-blue-700">#NET-0006</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">สถานที่</span>
          <span className="font-medium text-gray-900">อาคารเรียน 1 · ห้อง 101</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">ประเภท</span>
          <span className="font-medium text-gray-900">อินเทอร์เน็ตช้า</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">วันที่แจ้ง</span>
          <span className="font-medium text-gray-900">2 ก.ย. 2569 · 10:15 น.</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-500">สถานะ</span>
          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">รอตรวจสอบ</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onNav('issue-detail', 'NET-0001')}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors"
        >
          ดูรายละเอียด <ArrowRight size={16} />
        </button>
        <button
          onClick={() => onNav('dashboard')}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Home size={16} /> กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}
