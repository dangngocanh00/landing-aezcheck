import type { Locale } from './LanguageContext'

type StackCopy = {
  navigation: string; views: string[]; titles: string[]; open: string;
  connected: string; accounts: string; disconnected: string; stable: string;
  statusTitle: string; statuses: string[]; trend: string; breakdown: string; trendDescription: string;
  risks: string[]; riskValues: string[]; billing: string; spendLabels: string[]; cardLabels: string[];
  progress: string; classified: string; other: string;
}
export const controlCenterStackCopy: Record<Locale, StackCopy> = {
  vi: {
    navigation: 'Góc nhìn trung tâm điều hành', views: ['Tổng quan', 'Phân tích', 'Chi tiêu'],
    titles: ['Tổng quan hệ thống', 'Xu hướng & phân tích trạng thái', 'Chi tiêu & thanh toán'], open: 'Xem {view}',
    connected: 'VIA đã kết nối', accounts: 'Tổng TKQC', disconnected: 'Mất kết nối', stable: 'Ổn định',
    statusTitle: 'Trạng thái tài khoản', statuses: ['Active', 'Disabled', 'Unsettled', 'Pending'],
    trend: 'Xu hướng trạng thái', breakdown: 'Cơ cấu tài khoản', trendDescription: 'Xu hướng mẫu: Active tăng nhẹ; Disabled ổn định.',
    risks: ['Mất quyền', 'Admin ẩn'], riskValues: ['0', '0'],
    billing: 'Thống kê chi tiêu', spendLabels: ['Đã chi tiêu quảng cáo', 'Đã lập hóa đơn', 'Tổng số dư', 'Cần thanh toán'],
    cardLabels: ['Số thẻ kết nối', 'Số dư thực tế', 'Gần tới ngưỡng', 'TKQC sắp thanh toán'], progress: 'Đã thanh toán hóa đơn', classified: 'TKQC', other: 'Khác',
  },
  en: {
    navigation: 'Control center views', views: ['Overview', 'Analytics', 'Spend'],
    titles: ['System overview', 'Status trends & analytics', 'Spend & payments'], open: 'View {view}',
    connected: 'Connected VIA accounts', accounts: 'Total ad accounts', disconnected: 'Disconnected', stable: 'Stable',
    statusTitle: 'Account status', statuses: ['Active', 'Disabled', 'Unsettled', 'Pending'],
    trend: 'Status trends', breakdown: 'Account breakdown', trendDescription: 'Sample trends: Active rises slightly; Disabled stays stable.',
    risks: ['Lost access', 'Hidden admins'], riskValues: ['0', '0'],
    billing: 'Spend statistics', spendLabels: ['Ad spend', 'Total invoiced', 'Total balance', 'Payment due'],
    cardLabels: ['Connected cards', 'Actual balance', 'Near threshold', 'Accounts due soon'], progress: 'Invoices paid', classified: 'Accounts', other: 'Other',
  },
}
