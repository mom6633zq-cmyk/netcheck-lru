// Shared UI constants. All ticket / analytics data now comes from the API (see src/lib/api.ts).
export type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

export const STATUS_LABEL: Record<TicketStatus, string> = {
  pending: 'รอตรวจสอบ',
  in_progress: 'กำลังดำเนินการ',
  resolved: 'แก้ไขแล้ว',
  closed: 'ปิดงาน',
};

export const STATUS_COLOR: Record<TicketStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-blue-100 text-blue-700',
};
