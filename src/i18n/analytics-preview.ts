import type { Locale } from './LanguageContext'

type AnalyticsCopy = {
  title: string; subtitle: string; sample: string; connected: string; operating: string;
  accounts: string; business: string; personal: string;
  statuses: Record<'active' | 'disabled' | 'unsettled' | 'pending', string>;
  trendTitle: string; trendDescription: string; structureTitle: string; structureDescription: string;
  classified: string; riskTitle: string; lostAccess: string; hiddenAdmins: string; noWarnings: string;
  floatingTrendTitle: string; stable: string; floatingTrendCaption: string; zeroWarnings: string; floatingRiskCaption: string;
}

export const analyticsPreviewCopy: Record<Locale, AnalyticsCopy> = {
  vi: {
    title: 'Báo cáo & phân tích', subtitle: 'Theo dõi toàn cảnh tài sản, trạng thái TKQC và tín hiệu rủi ro theo thời gian thực',
    sample: 'MINH HỌA • DỮ LIỆU MẪU', connected: 'Số lượng VIA đã kết nối', operating: 'Đang hoạt động',
    accounts: 'Tổng lượng tài khoản quảng cáo', business: 'Tài khoản doanh nghiệp', personal: 'Tài khoản cá nhân',
    statuses: { active: 'Active', disabled: 'Disabled', unsettled: 'Unsettled', pending: 'Pending Payment' },
    trendTitle: 'Xu hướng biến động trạng thái TKQC', trendDescription: 'Xu hướng mẫu tháng 9: Active từ 8 xuống 7, Disabled từ 0 lên 7, Unsettled giữ ở 0.',
    structureTitle: 'Cơ cấu trạng thái TKQC', structureDescription: 'Cơ cấu mẫu: Active 9,382; Disabled 25,717; Unsettled 750; Pending Payment 0.',
    classified: 'Đã phân loại', riskTitle: 'Rủi ro bảo mật', lostAccess: 'Tài khoản bị mất quyền', hiddenAdmins: 'Số lượng admin ẩn', noWarnings: 'Không có cảnh báo',
    floatingTrendTitle: 'Xu hướng trạng thái', stable: 'Active ổn định', floatingTrendCaption: 'Theo dõi biến động tài khoản theo thời gian',
    zeroWarnings: '0 cảnh báo', floatingRiskCaption: 'Mất quyền truy cập và admin ẩn đang ở mức an toàn',
  },
  en: {
    title: 'Reports & analytics', subtitle: 'Monitor assets, ad account status and risk signals in real time',
    sample: 'ILLUSTRATION • SAMPLE DATA', connected: 'Connected VIA accounts', operating: 'Operating',
    accounts: 'Total ad accounts', business: 'Business accounts', personal: 'Personal accounts',
    statuses: { active: 'Active', disabled: 'Disabled', unsettled: 'Unsettled', pending: 'Pending Payment' },
    trendTitle: 'Ad account status trends', trendDescription: 'September sample trends: Active falls from 8 to 7, Disabled rises from 0 to 7, Unsettled stays at 0.',
    structureTitle: 'Ad account status breakdown', structureDescription: 'Sample breakdown: Active 9,382; Disabled 25,717; Unsettled 750; Pending Payment 0.',
    classified: 'Classified', riskTitle: 'Security risks', lostAccess: 'Accounts with lost access', hiddenAdmins: 'Hidden admins', noWarnings: 'No warnings',
    floatingTrendTitle: 'Status trends', stable: 'Active stays stable', floatingTrendCaption: 'Track account changes over time',
    zeroWarnings: '0 warnings', floatingRiskCaption: 'Access loss and hidden admins remain at safe levels',
  },
}
