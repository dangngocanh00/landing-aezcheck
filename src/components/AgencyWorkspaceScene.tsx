import { useLanguage } from '../i18n/LanguageContext'
import { AgencyWorkspaceSpendCard, AgencyWorkspaceReconcileCard } from './AgencyWorkspaceMetricCards'
import './agency-workspace-scene.css'

const groups = [
  { name: 'Growth Alpha', owner: 'Minh Anh', accounts: 12, status: 'active', market: 'US', tag: 'Scale', synced: ['2 giờ trước', '2 hours ago'] },
  { name: 'Performance East', owner: 'Gia Huy', accounts: 9, status: 'active', market: 'US', tag: 'Agency', synced: ['1 ngày trước', '1 day ago'] },
  { name: 'Brand Launch', owner: 'Thu Hà', accounts: 5, status: 'review', market: 'CA', tag: 'New', synced: ['3 giờ trước', '3 hours ago'] },
  { name: 'Commerce Boost', owner: 'Hoàng Nam', accounts: 14, status: 'active', market: 'UK', tag: 'Priority', synced: ['30 phút trước', '30 minutes ago'] },
  { name: 'Global Retarget', owner: 'Lan Chi', accounts: 7, status: 'paused', market: 'AU', tag: 'Retarget', synced: ['6 giờ trước', '6 hours ago'] },
  { name: 'Creative Lab', owner: 'Quang Huy', accounts: 4, status: 'active', market: 'SG', tag: 'Test', synced: ['2 ngày trước', '2 days ago'] },
] as const

export function AgencyWorkspaceProductPreview() {
  const { language } = useLanguage()
  const c = (vi: string, en: string) => language === 'vi' ? vi : en
  const tabs = [c('Nhóm', 'Teams'), c('Nhân sự', 'Staff'), c('Khách hàng', 'Clients'), c('TKQC cho thuê', 'Rented TKQC'), c('Chi tiêu TKQC', 'TKQC spend')]
  const headings = [c('Tên nhóm', 'Team name'), c('Trưởng nhóm', 'Team lead'), c('Tài khoản quảng cáo', 'Ad accounts'), c('Trạng thái nhóm', 'Team status'), c('Thị trường', 'Market'), 'Tags', c('Đồng bộ gần nhất', 'Last synced')]
  const statuses = { active: c('Hoạt động', 'Active'), review: c('Cần kiểm tra', 'Needs review'), paused: c('Tạm dừng', 'Paused') }
  const actions = [c('Đặt lại bộ lọc', 'Reset filters'), c('Xuất Excel', 'Export Excel'), c('Tùy chỉnh', 'Customize'), c('Lịch sử', 'History'), 'Shield', 'Tag']
  return <div className="aw-product">
    <header className="aw-product-header">
      <h3><i aria-hidden="true" />Agency Workspace</h3>
      <span className="aw-admin"><span aria-hidden="true">W</span>Workspace Admin</span>
    </header>
    <div className="aw-product-tabs" aria-label={c('Các mục sản phẩm minh họa', 'Illustrative product navigation')}>
      {tabs.map((tab, i) => <span key={tab} className={i === 0 ? 'is-selected' : undefined} aria-current={i === 0 ? 'page' : undefined}>{tab}</span>)}
    </div>
    <div className="aw-product-toolbar" aria-hidden="true">
      <span className="aw-search"><svg viewBox="0 0 20 20" fill="none"><circle cx="8" cy="8" r="5" /><path d="m12 12 5 5" /></svg>{c('Tìm nhóm hoặc ID nhóm', 'Search team or team ID')}</span>
      <div className="aw-toolbar-actions">{actions.map(action => <span key={action} className="aw-toolbar-action">{action}</span>)}</div>
    </div>
    <div className="aw-table-wrap"><table>
      <caption>{c('Nhóm · dữ liệu minh họa', 'Teams · illustrative data')}</caption>
      <thead><tr>{headings.map((heading, i) => <th key={heading} scope="col">{heading}{i === 0 && <span aria-hidden="true"> ↓</span>}</th>)}</tr></thead>
      <tbody>{groups.map(group => <tr key={group.name}>
        <td><span className="aw-checkbox" aria-hidden="true" />{group.name}</td>
        <td><span className="aw-initial" aria-hidden="true">{group.owner.split(' ').map(n => n[0]).join('')}</span>{group.owner}</td>
        <td>{group.accounts} <span className="aw-account-unit">TKQC</span></td>
        <td><span className={`aw-status aw-status--${group.status}`}>{statuses[group.status]}</span></td>
        <td>{group.market}</td>
        <td><span className="aw-tag">{group.tag}</span></td>
        <td>{c(group.synced[0], group.synced[1])}</td>
      </tr>)}</tbody>
    </table></div>
    <footer className="aw-product-footer"><span>{c('Hiển thị 1–6 trên tổng số 48 nhóm', 'Showing 1–6 of 48 teams')}</span><span className="aw-pagination" aria-hidden="true"><span>‹</span><b>1</b><span>2</span><span>3</span><span>…</span><span>8</span><span>›</span></span></footer>
  </div>
}

export function AgencyWorkspaceScene() {
  return <div className="aw-scene">
    <div className="aw-main"><AgencyWorkspaceProductPreview /></div>
    <div className="aw-floating-cards">
      <div className="aw-spend"><AgencyWorkspaceSpendCard /></div>
      <div className="aw-reconcile"><AgencyWorkspaceReconcileCard /></div>
    </div>
  </div>
}
