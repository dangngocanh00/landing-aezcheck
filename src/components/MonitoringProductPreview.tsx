import { localizeNode, translateText } from '../i18n/localize'
import { useLanguage } from '../i18n/LanguageContext'
import { monitoringPreviewCopy } from '../i18n/monitoring-preview'
import './monitoring-product-preview.css'

// Static illustration data. Token countdowns describe the sample, not live accounts.
const vias = [
  { name: 'Noah Carter', id: '148205771903', uid: '148205771903644', bm: 5, twoFA: true, expiry: '24/11/2026', days: 58, status: 'active', permissions: ['bill', 'spend'], accounts: 96 },
  { name: 'Emma Laurent', id: '226711480355', uid: '226711480355902', bm: 3, twoFA: true, expiry: '16/11/2026', days: 50, status: 'active', permissions: ['via'], accounts: 71 },
  { name: 'Liam Brooks', id: '317804992661', uid: '317804992661400', bm: 2, twoFA: false, expiry: '01/10/2026', days: 4, status: 'attention', permissions: ['spend'], accounts: 28 },
  { name: 'Mia Turner', id: '469112780524', uid: '469112780524731', bm: 6, twoFA: true, expiry: '20/11/2026', days: 54, status: 'active', permissions: ['bill', 'bm'], accounts: 118 },
] as const

export function MonitoringProductPreview() {
  const { language } = useLanguage()
  const copy = monitoringPreviewCopy[language]
  return <div className="monitor-preview">
    <header className="monitor-header"><h3>{localizeNode(copy.title)}</h3><span>{localizeNode(copy.sample)}</span><p>{localizeNode(copy.subtitle)}</p></header>
    <div className="monitor-tabs">{localizeNode(copy.tabs.map((tab, i) => <span key={tab} className={i === 0 ? 'is-active' : undefined} aria-current={i === 0 ? 'page' : undefined}>{localizeNode(tab)}</span>))}</div>
    <div className="monitor-search" role="img" aria-label={translateText(copy.search)}><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><span>{localizeNode(copy.search)}</span></div>
    <div className="monitor-table-wrap"><table>
      <caption>{localizeNode(copy.sample)}</caption>
      <colgroup>{localizeNode([27, 7, 10, 16, 13, 19, 8].map((width, i) => <col key={i} style={{ width: `${width}%` }} />))}</colgroup>
      <thead><tr>{localizeNode(copy.columns.map(label => <th scope="col" key={label}>{localizeNode(label)}</th>))}</tr></thead>
      <tbody>{localizeNode(vias.map((via) => <tr key={via.uid}>
        <td><div className="monitor-via-name"><span className="monitor-avatar" aria-hidden="true">{localizeNode(via.name.split(' ').map(n => n[0]).join(''))}</span><strong>{localizeNode(via.name)}</strong></div><small>{localizeNode(copy.id)}{localizeNode(": ")}{localizeNode(via.id)}</small><small>{localizeNode(copy.uid)}{localizeNode(": ")}{localizeNode(via.uid)}</small></td>
        <td>{localizeNode(via.bm)}</td>
        <td><span className={`monitor-2fa ${via.twoFA ? 'is-enabled' : 'is-disabled'}`}><svg viewBox="0 0 20 22" aria-hidden="true"><path d="m10 2 7 3v6c0 5-4 8-7 9-3-1-7-4-7-9V5Z" /><path d={via.twoFA ? 'm6 10 3 3 5-6' : 'm7 8 6 6m0-6-6 6'} /></svg>{localizeNode(via.twoFA ? copy.enabled : copy.disabled)}</span></td>
        <td><span className="monitor-expiry">{localizeNode(via.expiry)}</span><small className={`monitor-remaining ${via.days <= 7 ? 'is-warning' : ''}`}>{localizeNode(copy.remaining.replace('{days}', String(via.days)))}</small></td>
        <td><span className={`monitor-status monitor-status--${via.status}`}>{localizeNode(copy.statuses[via.status])}</span></td>
        <td><div className="monitor-permissions">{localizeNode(via.permissions.map(permission => <span key={permission}>{localizeNode(copy.permissions[permission])}</span>))}</div></td>
        <td>{localizeNode(via.accounts)}</td>
      </tr>))}</tbody>
    </table></div>
    <footer className="monitor-footer"><span>{localizeNode(copy.summary)}</span><span className="monitor-pagination" aria-hidden="true"><span>{localizeNode("‹")}</span><b>{localizeNode("1")}</b><span>{localizeNode("2")}</span><span>{localizeNode("3")}</span><span>{localizeNode("›")}</span></span></footer>
  </div>
}
