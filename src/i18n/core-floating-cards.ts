import type { Locale } from './LanguageContext'

type CoreCopy = {
  assetRelation: { title: string; subtitle: string; via: string; bm: string; adAccounts: string; fanpages: string; synced: string; syncedDescription: string }
  recentChange: { title: string; account: string; oldStatus: string; newStatus: string; time: string }
}
export const coreFloatingCards: Record<Locale, CoreCopy> = {
  vi: {
    assetRelation: { title: 'Liên kết tài sản', subtitle: 'Quản lý mối quan hệ tài sản theo hệ thống', via: 'VIA 1048', bm: '3 BM', adAccounts: '12 TKQC', fanpages: '8 Fanpage', synced: 'Đã đồng bộ', syncedDescription: 'Tất cả tài sản đã được liên kết và cập nhật thành công' },
    recentChange: { title: 'Thay đổi gần nhất', account: 'TKQC 4832', oldStatus: 'Hoạt động', newStatus: 'Vô hiệu hóa', time: '2 phút trước' },
  },
  en: {
    assetRelation: { title: 'Asset connections', subtitle: 'Manage asset relationships systematically', via: 'VIA 1048', bm: '3 BM', adAccounts: '12 ad accounts', fanpages: '8 Fanpages', synced: 'Synced', syncedDescription: 'All assets have been linked and updated successfully' },
    recentChange: { title: 'Recent change', account: 'Ad account 4832', oldStatus: 'Active', newStatus: 'Disabled', time: '2 minutes ago' },
  },
}
