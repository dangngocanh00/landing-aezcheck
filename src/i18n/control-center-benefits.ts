import type { Locale } from './LanguageContext'

export type ControlBenefitId = 'live' | 'trend' | 'risk' | 'network'
export const controlCenterBenefitsCopy: Record<Locale, Record<ControlBenefitId, { title: string; description: string }>> = {
  vi: {
    live: { title: 'Trạng thái trực tiếp', description: 'Xem trạng thái thực tế của từng tài khoản, từng VIA — không cần refresh thủ công.' },
    trend: { title: 'Theo dõi xu hướng', description: 'Phát hiện xu hướng chi tiêu, hiệu suất và rủi ro trước khi chúng trở thành sự cố.' },
    risk: { title: 'Tổng quan rủi ro', description: 'Tổng hợp cảnh báo và chỉ số nguy cơ trên một dashboard duy nhất.' },
    network: { title: 'Phân bổ tài sản', description: 'Theo dõi tài sản quảng cáo theo nhóm, nhân sự và khách hàng.' },
  },
  en: {
    live: { title: 'Live status', description: 'See the current status of every account and VIA — without refreshing manually.' },
    trend: { title: 'Trend monitoring', description: 'Spot spending, performance and risk trends before they become incidents.' },
    risk: { title: 'Risk overview', description: 'Bring alerts and risk indicators together in a single dashboard.' },
    network: { title: 'Asset distribution', description: 'Track advertising assets across teams, staff and clients.' },
  },
}
