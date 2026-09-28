import type { Locale } from './LanguageContext'

type MonitoringCopy = {
  title: string; subtitle: string; tabs: string[]; search: string;
  columns: string[]; enabled: string; disabled: string; statuses: Record<'active' | 'attention', string>;
  permissions: Record<'bill' | 'spend' | 'via' | 'bm', string>; remaining: string; summary: string; sample: string; id: string; uid: string;
}
export const monitoringPreviewCopy: Record<Locale, MonitoringCopy> = {
  vi: {
    title: 'Giám sát tài sản', subtitle: 'Theo dõi trạng thái VIA, token và quyền chạy quảng cáo',
    tabs: ['VIA', 'Tài khoản quảng cáo', 'BM', 'Fanpage'],
    search: 'Tìm VIA / UID...',
    columns: ['Thông tin VIA', 'Số BM', '2FA', 'Token hết hạn', 'Trạng thái', 'Quyền chạy', 'Tổng TKQC'],
    enabled: 'Đã bật', disabled: 'Chưa bật', statuses: { active: 'Hoạt động', attention: 'Cần chú ý' },
    permissions: { bill: 'Check bill', spend: 'Check spend', via: 'Check VIA account', bm: 'Check BM account' },
    remaining: 'Còn {days} ngày', summary: '4 VIA mẫu', sample: 'Dữ liệu minh họa', id: 'ID', uid: 'UID',
  },
  en: {
    title: 'Asset monitoring', subtitle: 'Monitor VIA status, tokens and advertising permissions',
    tabs: ['VIA', 'Ad accounts', 'BM', 'Fanpage'],
    search: 'Search VIA / UID...',
    columns: ['VIA information', 'BM count', '2FA', 'Token expiry', 'Status', 'Ad permissions', 'Ad accounts'],
    enabled: 'Enabled', disabled: 'Not enabled', statuses: { active: 'Active', attention: 'Needs attention' },
    permissions: { bill: 'Check bill', spend: 'Check spend', via: 'Check VIA account', bm: 'Check BM account' },
    remaining: '{days} days left', summary: '4 sample VIAs', sample: 'Illustrative data', id: 'ID', uid: 'UID',
  },
}
