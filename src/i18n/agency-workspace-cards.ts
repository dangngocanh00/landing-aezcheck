import type { Locale } from './LanguageContext'

type CardCopy = { title: string; value: string; subtitle: string }
export const agencyWorkspaceCards: Record<Locale, { spend: CardCopy; reconcile: CardCopy }> = {
  vi: {
    spend: { title: 'Chi tiêu TKQC', value: '100.000.000đ', subtitle: '+28.5% so với tháng trước' },
    reconcile: { title: 'Đối soát chi tiêu', value: '100% khớp', subtitle: 'Dữ liệu minh bạch, chính xác' },
  },
  en: {
    spend: { title: 'Ad account spend', value: 'VND 100,000,000', subtitle: '+28.5% vs. last month' },
    reconcile: { title: 'Spend reconciliation', value: '100% matched', subtitle: 'Transparent, accurate data' },
  },
}
