import { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, Ticket, Meta } from '../lib/api';

const PIE_COLORS = ['#1d4ed8', '#0ea5e9', '#6366f1', '#8b5cf6', '#a8a29e', '#f97316'];

export default function AdminAnalytics() {
  const [filterBuilding, setFilterBuilding] = useState('');
  const [filterType, setFilterType] = useState('');
  const [meta, setMeta] = useState<Meta | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.meta().then(setMeta); }, []);

  useEffect(() => {
    setLoading(true);
    api.listTickets({ building: filterBuilding, type: filterType })
      .then(d => setTickets(d.tickets))
      .finally(() => setLoading(false));
  }, [filterBuilding, filterType]);

  const analysis = useMemo(() => {
    const total = tickets.length;
    const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

    const byMonthMap = new Map<string, { total: number; resolved: number }>();
    const byTypeMap = new Map<string, number>();
    const byBuildingMap = new Map<string, number>();
    const resolutionHours: Record<string, number[]> = {};

    for (const t of tickets) {
      const month = t.createdAt.slice(0, 7);
      const m = byMonthMap.get(month) || { total: 0, resolved: 0 };
      m.total += 1;
      if (t.status === 'resolved' || t.status === 'closed') m.resolved += 1;
      byMonthMap.set(month, m);

      byTypeMap.set(t.type, (byTypeMap.get(t.type) || 0) + 1);
      byBuildingMap.set(t.building, (byBuildingMap.get(t.building) || 0) + 1);

      if (t.status === 'resolved' || t.status === 'closed') {
        const hours = (new Date(t.updatedAt.replace(' ', 'T')).getTime() - new Date(t.createdAt.replace(' ', 'T')).getTime()) / 36e5;
        if (Number.isFinite(hours) && hours >= 0) {
          resolutionHours[t.building] = resolutionHours[t.building] || [];
          resolutionHours[t.building].push(hours);
        }
      }
    }

    const monthlyData = Array.from(byMonthMap.entries()).sort().map(([month, v]) => ({ month, ...v }));
    const issueTypeData = Array.from(byTypeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: PIE_COLORS[i % PIE_COLORS.length] }));
    const buildingData = Array.from(byBuildingMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([building, count]) => ({ building, count }));
    const avgResolutionData = Object.entries(resolutionHours)
      .map(([building, arr]) => ({ building, hours: Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 }))
      .sort((a, b) => a.hours - b.hours);

    const avgHours = Object.values(resolutionHours).flat();
    const avgResolutionOverall = avgHours.length ? Math.round((avgHours.reduce((a, b) => a + b, 0) / avgHours.length) * 10) / 10 : 0;

    const topBuilding = buildingData[0];
    const topType = issueTypeData[0];
    const topMonth = [...monthlyData].sort((a, b) => b.total - a.total)[0];
    const fastestBuilding = avgResolutionData[0];

    return {
      total, resolvedCount, inProgressCount, avgResolutionOverall,
      monthlyData, issueTypeData, buildingData, avgResolutionData,
      insights: [
        { label: 'อาคารที่พบปัญหามากที่สุด', value: topBuilding?.building || '—', detail: topBuilding ? `${topBuilding.count} ปัญหา (${Math.round((topBuilding.count / total) * 100)}%)` : '—' },
        { label: 'ประเภทปัญหาที่พบบ่อยที่สุด', value: topType?.name || '—', detail: topType ? `${topType.value} ปัญหา (${Math.round((topType.value / total) * 100)}%)` : '—' },
        { label: 'เดือนที่มีปัญหามากที่สุด', value: topMonth?.month || '—', detail: topMonth ? `${topMonth.total} ปัญหา` : '—' },
        { label: 'อาคารที่แก้ไขเร็วที่สุด', value: fastestBuilding?.building || '—', detail: fastestBuilding ? `เฉลี่ย ${fastestBuilding.hours} ชั่วโมง` : '—' },
      ],
    };
  }, [tickets]);

  const summaryStats = [
    { label: 'ปัญหาทั้งหมด', value: analysis.total, icon: AlertCircle, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'แก้ไขแล้ว', value: analysis.resolvedCount, icon: CheckCircle2, color: 'text-green-700', bg: 'bg-green-50' },
    { label: 'ยังดำเนินการ', value: analysis.inProgressCount, icon: TrendingUp, color: 'text-yellow-700', bg: 'bg-yellow-50' },
    { label: 'เวลาเฉลี่ย', value: analysis.avgResolutionOverall ? `${analysis.avgResolutionOverall} ชม.` : '—', icon: Clock, color: 'text-purple-700', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">วิเคราะห์ข้อมูลเครือข่าย</h1>
        <p className="text-sm text-gray-500">ภาพรวมสถิติและแนวโน้มปัญหาเครือข่าย (คำนวณจากข้อมูลจริงในฐานข้อมูล)</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">อาคาร</label>
            <select value={filterBuilding} onChange={e => setFilterBuilding(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500">
              <option value="">ทุกอาคาร</option>
              {(meta?.buildings || []).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ประเภทปัญหา</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-500">
              <option value="">ทุกประเภท</option>
              {(meta?.issueTypes || []).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {(filterBuilding || filterType) && (
            <button onClick={() => { setFilterBuilding(''); setFilterType(''); }} className="px-4 py-2 text-sm text-red-500 hover:text-red-700">
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {loading ? <div className="text-sm text-gray-400 text-center py-10">กำลังโหลด...</div> : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {summaryStats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">จำนวนปัญหาแต่ละเดือน</h2>
              {analysis.monthlyData.length === 0 ? <div className="text-xs text-gray-400 py-10 text-center">ยังไม่มีข้อมูล</div> : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={analysis.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="total" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 4 }} name="แจ้งปัญหา" />
                    <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} name="แก้ไขแล้ว" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">ประเภทปัญหา</h2>
              {analysis.issueTypeData.length === 0 ? <div className="text-xs text-gray-400 py-10 text-center">ยังไม่มีข้อมูล</div> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={analysis.issueTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                        {analysis.issueTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} ปัญหา`]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {analysis.issueTypeData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-gray-600">{d.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">ปัญหาแยกตามอาคาร</h2>
              {analysis.buildingData.length === 0 ? <div className="text-xs text-gray-400 py-10 text-center">ยังไม่มีข้อมูล</div> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analysis.buildingData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="building" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1d4ed8" radius={[6, 6, 0, 0]} name="ปัญหา" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">เวลาเฉลี่ยในการแก้ไข (ชั่วโมง)</h2>
              {analysis.avgResolutionData.length === 0 ? <div className="text-xs text-gray-400 py-10 text-center">ยังไม่มีข้อมูล</div> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analysis.avgResolutionData} barSize={28} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="building" type="category" tick={{ fontSize: 10 }} width={70} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#0ea5e9" radius={[0, 6, 6, 0]} name="ชั่วโมง" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Insight Cards */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">สรุปข้อมูลเชิงลึก</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {analysis.insights.map((ins) => (
                <div key={ins.label} className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4">
                  <div className="text-xs text-gray-500 mb-1">{ins.label}</div>
                  <div className="text-base font-bold text-blue-700 mb-0.5">{ins.value}</div>
                  <div className="text-xs text-gray-500">{ins.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
