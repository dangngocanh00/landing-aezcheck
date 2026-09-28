import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { Brand } from './Brand'
import { AnalyticsScene } from './AnalyticsScene'
import { AgencyWorkspaceScene } from './AgencyWorkspaceScene'
import { CoreAssetRelationCard, CoreRecentChangeCard } from './CoreFloatingCards'
import { MonitoringProductPreview } from './MonitoringProductPreview'
import { spotlightCopy, type FeatureId } from './feature-spotlight-data'
import './feature-spotlight.css'
import './support-floating-cards.css'

type PreviewId = Exclude<FeatureId, 'workspace'>
type Pair = [string, string]
const tabs: Record<PreviewId, Pair[]> = {

  core: [['VIA', 'VIA'], ['Tài khoản quảng cáo', 'Ad accounts'], ['BM', 'BM'], ['Fanpage', 'Fanpage']],
  finance: [['Nhóm', 'Teams'], ['Nhân sự', 'Staff'], ['Khách hàng', 'Clients'], ['TKQC cho thuê', 'Rented TKQC'], ['Chi tiêu TKQC', 'TKQC spend']],
  monitoring: [['Trạng thái VIA', 'VIA status'], ['Token', 'Tokens'], ['2FA', '2FA'], ['Trạng thái TKQC', 'TKQC status']],
  reports: [['Chi tiêu theo ngày', 'Daily spend'], ['Auto / CS', 'Auto / CS'], ['Đối soát', 'Reconciliation']],
}
const titles: Record<PreviewId, Pair> = {
  core: ['Tài sản & quảng cáo', 'Assets & advertising'],
  finance: ['Tài chính khách thuê', 'Rental client finances'], monitoring: ['Giám sát vận hành', 'Operations monitoring'], reports: ['Chi tiêu & đối soát', 'Spend & reconciliation'],
}

function Preview({ id }: { id: PreviewId }) {
  const { language } = useLanguage()
  const c = (vi: string, en: string) => language === 'vi' ? vi : en
  const chartId = useId()
  const headings: Record<PreviewId, string[]> = {

    core: [c('UID / tên', 'UID / name'), 'BM', 'Token', c('Trạng thái', 'Status')],
    finance: [c('Khách hàng', 'Client'), c('Nhân sự phụ trách', 'Account owner'), c('TKQC thuê', 'Rented accounts'), c('Tổng tiền nạp', 'Deposits'), c('Loại thu phí', 'Fee rate'), c('Tổng phí thuê', 'Rental fees'), c('Đã chi tiêu', 'Spent'), c('Số dư hạn mức', 'Remaining limit'), c('Công nợ', 'Due')],
    monitoring: [c('Tài sản', 'Asset'), '2FA', c('Token hết hạn', 'Token expiry'), c('Quyền quảng cáo', 'Ad permission')],
    reports: [c('Ngày', 'Day'), 'Auto', 'CS', c('Chênh lệch', 'Difference')],
  }
  const rows: Record<PreviewId, string[][]> = {
    core: [['VIA · 1048', 'BM · 201', c('Còn hạn', 'Valid'), c('Hoạt động', 'Active')], ['VIA · 1062', 'BM · 202', c('Sắp hết hạn', 'Expiring'), c('Cần chú ý', 'Review')], ['VIA · 1080', 'BM · 201', c('Còn hạn', 'Valid'), c('Hoạt động', 'Active')]],
    finance: [
      ['Nova Media', 'Minh Anh', '4', '120.000.000đ', '4%', '4.800.000đ', '86.500.000đ', '33.500.000đ', '0đ'],
      ['Horizon Ads', 'Gia Huy', '3', '95.000.000đ', '5%', '4.750.000đ', '74.200.000đ', '20.800.000đ', '420.000đ'],
      ['Pixel House', 'Thu Hà', '2', '68.000.000đ', '4%', '2.720.000đ', '51.400.000đ', '16.600.000đ', '0đ'],
      ['Brand Bloom', 'Hoàng Nam', '5', '150.000.000đ', '5%', '7.500.000đ', '109.300.000đ', '40.700.000đ', '1.180.000đ'],
      ['Orion Commerce', 'Lan Chi', '3', '82.000.000đ', '4%', '3.280.000đ', '60.800.000đ', '21.200.000đ', '260.000đ'],
    ],
    monitoring: [['VIA · 1048', c('Đã bật', 'Enabled'), '28/09', c('Được phép', 'Allowed')], ['VIA · 1062', c('Chưa bật', 'Not enabled'), '12/09', c('Cần kiểm tra', 'Review')], ['TKQC · 208', '—', '—', c('Cần kiểm tra', 'Review')]],
    reports: [['12/09', '$1,280', '$1,280', '$0'], ['13/09', '$1,460', '$1,440', '$20'], ['14/09', '$1,620', '$1,620', '$0']],
  }
  const metrics: Record<Extract<FeatureId, 'reports'>, [string, string][]> = {

    reports: [[c('Chi tiêu Auto', 'Auto spend'), '$4,360'], [c('Chi tiêu CS', 'CS spend'), '$4,340'], [c('Cần đối soát', 'To reconcile'), '$20']],
  }
  const floats: Record<PreviewId, [string, string, string][]> = {

    core: [[c('Tài sản Facebook', 'Facebook assets'), 'VIA · BM', 'TKQC · Fanpage'], [c('Trạng thái token', 'Token status'), '01', c('Token cần chú ý', 'Token to review')]],
    finance: [[c('Phí thuê dự kiến', 'Expected rental fees'), '23.050.000đ', c('Tổng phí trong kỳ mẫu', 'Sample period fees')], [c('TKQC chờ quyết toán', 'Pending TKQC settlement'), '02', c('Kiểm tra chi tiêu & công nợ', 'Review spend & balances')]],
    monitoring: [[c('Token sắp hết hạn', 'Expiring token'), 'VIA · 1062', c('Kiểm tra thời điểm hết hạn', 'Check expiration date')], [c('Trạng thái 2FA', '2FA status'), '01', c('VIA chưa bật 2FA', 'VIA without 2FA')]],
    reports: [[c('Đối chiếu Auto / CS', 'Auto / CS comparison'), '$20', c('Chênh lệch cần kiểm tra', 'Difference to review')], [c('Xuất dữ liệu', 'Data export'), c('Theo bộ lọc', 'By filters'), c('Phục vụ kiểm tra & báo cáo', 'For review & reporting')]],
  }
  return <>
    {id === 'monitoring' ? <MonitoringProductPreview /> : <div className="spot-product">
      <div className="spot-product-top"><Brand variant="compact" /><span>{c('MINH HỌA · DỮ LIỆU MẪU', 'ILLUSTRATION · SAMPLE DATA')}</span></div>
      <h3>{c(...titles[id])}</h3>
      <div className="spot-preview-tabs" aria-hidden="true">{tabs[id].map((tab, index) => <span key={tab[1]} className={index === (id === 'finance' ? 2 : 0) ? 'selected' : ''}>{c(...tab)}</span>)}</div>
      {id === 'finance' && <div className="finance-preview-toolbar" aria-hidden="true">
        <span className="finance-preview-search"><svg viewBox="0 0 20 20" fill="none"><circle cx="8" cy="8" r="5" /><path d="m12 12 5 5" /></svg>{c('Tìm khách hàng...', 'Search clients...')}</span>
        <span className="finance-preview-filter">{c('Tất cả nhân sự', 'All staff')}⌄</span>
        <div className="finance-preview-actions">{[c('Xuất Excel', 'Export Excel'), c('Tùy chỉnh', 'Customize'), c('Lịch sử', 'History')].map(label => <span key={label}>{label}</span>)}</div>
      </div>}
      {id === 'reports' && <div className="spot-metrics">{metrics[id].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>}
      {id === 'reports' && <div className="spot-chart">
        <div><span>{c('Chi tiêu TKQC theo ngày', 'Daily TKQC spend')}</span><small>Auto <i /> CS</small></div>
        <svg viewBox="0 0 600 120" role="img" aria-label={c('Biểu đồ minh họa chi tiêu Auto và CS', 'Illustrative Auto and CS spend chart')}>
          <defs><linearGradient id={chartId} x2="0" y2="1"><stop stopColor="#58e3b4" stopOpacity=".22" /><stop offset="1" stopColor="#58e3b4" stopOpacity="0" /></linearGradient></defs>
          <path d="M0 30H600M0 70H600M0 110H600" stroke="#a0e6cd12" />
          <path d="M0 95 60 80 120 85 180 56 240 66 300 36 360 52 420 28 480 36 540 16 600 10V120H0Z" fill={`url(#${chartId})`} />
          <path d="M0 95 60 80 120 85 180 56 240 66 300 36 360 52 420 28 480 36 540 16 600 10" stroke="#71efb2" fill="none" strokeWidth="2" />
          <path d="M0 99 60 86 120 84 180 61 240 66 300 43 360 55 420 37 480 42 540 20 600 16" stroke="#6ebfb8" fill="none" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </div>}
      <div className="spot-table-scroll"><table><thead><tr>{headings[id].map((h, index) => <th key={index} scope="col">{h || c('Thao tác', 'Actions')}</th>)}</tr></thead><tbody>{rows[id].map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{id === 'finance' ? <>
        {j === 0 && <span className="finance-preview-checkbox" aria-hidden="true" />}
        {j === 1 && <span className="finance-preview-avatar" aria-hidden="true">{cell.split(' ').map(n => n[0]).join('')}</span>}
        <span className={j === 4 ? 'finance-fee-tag' : j === 8 ? `finance-debt finance-debt--${cell === '0đ' ? 'clear' : 'due'}` : undefined}>{cell}</span>
        {j === 2 && <> {c('TKQC', 'accounts')}</>}
      </> : <>{j === 0 && <span className="spot-row-dot" />}{cell}</>}</td>)}</tr>)}</tbody></table></div>
      {id === 'finance' && <div className="finance-preview-footer"><span>{c('Hiển thị 1–5 trên tổng số 48 khách hàng', 'Showing 1–5 of 48 clients')}</span><span className="finance-preview-pagination" aria-hidden="true"><span>‹</span><b>1</b><span>2</span><span>3</span><span>…</span><span>10</span><span>›</span></span></div>}
    </div>}
    {id === 'core' ? <div className="spot-core-cards">
      <div className="core-card-slot"><CoreAssetRelationCard /></div>
      <div className="core-card-slot"><CoreRecentChangeCard /></div>
    </div> : <div className="spot-floating-cards">{floats[id].map(([label, value, caption], index) => <div key={label} className={`spot-float spot-float-${index}${id === 'finance' || id === 'monitoring' ? ' spot-support-card' : ''}`}><span className="spot-float-symbol" aria-hidden="true">{index === 0 ? '◇' : '↗'}</span><span>{label}</span><strong>{value}</strong><small>{caption}</small></div>)}</div>}
  </>
}

export function FeatureSpotlight() {
  const { language } = useLanguage()
  const [active, setActive] = useState<FeatureId>('workspace')
  const section = useRef<HTMLElement>(null)
  const prefix = useId()
  const items = spotlightCopy[language]
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 959px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 959px)')
    const sync = () => setCompact(query.matches)
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  const visual = <div className="spot-visual" aria-label={language === 'vi' ? 'Minh họa tính năng đang chọn' : 'Selected feature illustration'}>
    <div className="spot-decoration" aria-hidden="true"><div className="spot-orbit" /></div>
    {items.map(item => <div key={item.id} className={`spot-scene ${active === item.id ? 'is-active' : ''}`} data-scene={item.id} aria-hidden={active !== item.id} inert={active !== item.id}>{item.id === 'workspace' ? <AgencyWorkspaceScene /> : item.id === 'reports' ? <AnalyticsScene /> : <Preview id={item.id} />}</div>)}
  </div>
  useEffect(() => {
    const node = section.current
    if (!node) return
    let visible = false
    const sync = () => { node.dataset.paused = String(!visible || document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(node)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [])
  return <section ref={section} id="features" className="spot-section az-landing-section" aria-label={language === 'vi' ? 'Khám phá tính năng AezCheck' : 'Explore AezCheck features'} data-paused="true">
    <div className="spot-inner">
      <div className="spot-accordion">{items.map(item => {
        const open = active === item.id
        return <div key={item.id} className={`spot-item ${open ? 'is-active' : ''}`}>
          <h2><button id={`${prefix}-trigger-${item.id}`} aria-expanded={open} aria-controls={`${prefix}-panel-${item.id}`} onClick={() => setActive(item.id)}>
            <span>{item.id === 'workspace' ? <>Agency <em>Workspace</em></> : item.title}</span><span className="spot-chevron" aria-hidden="true">⌄</span>
          </button></h2>
          <div className="spot-expand" id={`${prefix}-panel-${item.id}`} role="region" aria-labelledby={`${prefix}-trigger-${item.id}`} aria-hidden={!open} inert={!open}>
            <div className="spot-expand-clip"><div className="spot-copy">
              {item.id === 'workspace' ? <><h3 className="spot-subtitle">{item.headline}</h3><span className="spot-kicker">{item.kicker}</span></> : <><span className="spot-kicker">{item.kicker}</span><h3>{item.headline}</h3></>}
              <p>{item.description}</p>
              {item.id === 'workspace' && <span className="spot-kicker">{language === 'vi' ? 'Chức năng chính:' : 'Key features:'}</span>}
              <ul className={item.id === 'workspace' ? 'spot-inline-details' : ''}>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
              <a className="spot-cta" href={item.href}>{item.cta}<span aria-hidden="true">↗</span></a>
            </div>{compact && open && visual}</div>
          </div>
        </div>
      })}</div>
      {!compact && visual}
    </div>
  </section>
}
