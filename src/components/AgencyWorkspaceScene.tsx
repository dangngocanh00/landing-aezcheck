import { localizeNode, translateText } from '../i18n/localize'
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
      <h3><i aria-hidden="true" />{localizeNode("Agency Workspace")}</h3>
      <span className="aw-admin"><span aria-hidden="true">{localizeNode("W")}</span>{localizeNode("Workspace Admin")}</span>
    </header>
    <div className="aw-product-tabs" aria-label={translateText(c('Các mục sản phẩm minh họa', 'Illustrative product navigation'))}>
      {localizeNode(tabs.map((tab, i) => <span key={tab} className={i === 0 ? 'is-selected' : undefined} aria-current={i === 0 ? 'page' : undefined}>{localizeNode(tab)}</span>))}
    </div>
    <div className="aw-product-toolbar" aria-hidden="true">
      <span className="aw-search"><svg viewBox="0 0 20 20" fill="none"><circle cx="8" cy="8" r="5" /><path d="m12 12 5 5" /></svg>{localizeNode(c('Tìm nhóm hoặc ID nhóm', 'Search team or team ID'))}</span>
      <div className="aw-toolbar-actions">{localizeNode(actions.map(action => <span key={action} className="aw-toolbar-action">{localizeNode(action)}</span>))}</div>
    </div>
    <div className="aw-table-wrap"><table>
      <caption>{localizeNode(c('Nhóm · dữ liệu minh họa', 'Teams · illustrative data'))}</caption>
      <thead><tr>{localizeNode(headings.map((heading, i) => <th key={heading} scope="col">{localizeNode(heading)}{localizeNode(i === 0 && <span aria-hidden="true">{localizeNode(" ↓")}</span>)}</th>))}</tr></thead>
      <tbody>{localizeNode(groups.map(group => <tr key={group.name}>
        <td><span className="aw-checkbox" aria-hidden="true" />{localizeNode(group.name)}</td>
        <td><span className="aw-initial" aria-hidden="true">{localizeNode(group.owner.split(' ').map(n => n[0]).join(''))}</span>{localizeNode(group.owner)}</td>
        <td>{localizeNode(group.accounts)} <span className="aw-account-unit">{localizeNode("TKQC")}</span></td>
        <td><span className={`aw-status aw-status--${group.status}`}>{localizeNode(statuses[group.status])}</span></td>
        <td>{localizeNode(group.market)}</td>
        <td><span className="aw-tag">{localizeNode(group.tag)}</span></td>
        <td>{localizeNode(c(group.synced[0], group.synced[1]))}</td>
      </tr>))}</tbody>
    </table></div>
    <footer className="aw-product-footer"><span>{localizeNode(c('Hiển thị 1–6 trên tổng số 48 nhóm', 'Showing 1–6 of 48 teams'))}</span><span className="aw-pagination" aria-hidden="true"><span>{localizeNode("‹")}</span><b>{localizeNode("1")}</b><span>{localizeNode("2")}</span><span>{localizeNode("3")}</span><span>{localizeNode("…")}</span><span>{localizeNode("8")}</span><span>{localizeNode("›")}</span></span></footer>
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
