import './landing-background.css'
import './card-system.css'
import './components/benefit-glass-cards.css'
import { LandingBackground } from './components/LandingBackground'
import { ControlCenterBenefits } from './components/ControlCenterBenefits'
import { ControlCenterIllustrationStack } from './components/ControlCenterIllustrationStack'
import { ChallengeSection } from './components/ChallengeSection'
import { FeatureSpotlight } from './components/FeatureSpotlight'
import { ProductEcosystemSection } from './components/ProductEcosystemSection'
import { useLanguage } from './i18n/LanguageContext'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Navbar, Hero } from './components/LandingOpening'
import { Brand } from './components/Brand'
import { AdsManagementPreview } from './components/AdsManagementPreview'
import { ShieldIllustration } from './components/ShieldIllustration'
import { landingFooterItems, landingSupportItems, landingNavItems, landingExperienceDestination, landingContactDestination, getLegalPage, getSiteRoute, localizedHref } from './landing-navigation'
import { TermsPage } from './components/TermsPage'
import { PrivacyPage } from './components/PrivacyPage'
import { footerSupportCopy } from './i18n/footer-support'
import { PricingPage } from './components/PricingPage'
import { PageMetadata } from './components/PageMetadata'

const GuidePage = lazy(() => import('./pages/GuidePage').then(module => ({ default: module.GuidePage })))

// ─── Layout primitives ────────────────────────────────────────────────────────

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-[1200px] min-w-0 mx-auto ${className}`}>{children}</div>
}

function Section({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`az-landing-section py-24 px-4 min-[480px]:px-6 ${className}`}
    >
      {children}
    </section>
  )
}

// ─── Design system atoms ──────────────────────────────────────────────────────

function Heading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-az-text ${className}`}>
      {children}
    </h2>
  )
}

function Green({ children }: { children: React.ReactNode }) {
  return <span className="text-az-green">{children}</span>
}

function Btn({
  children,
  variant = 'primary',
  className = '',
  href,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
  href?: string
}) {
  const base =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer'
  const v =
    variant === 'primary'
      ? 'bg-az-green text-[var(--on-accent)] hover:bg-az-bright'
      : 'border border-az-green/40 text-az-green hover:border-az-green hover:bg-az-green/10'
  return href ? <a href={href} className={`${base} ${v} ${className}`}>{children}</a> : <button className={`${base} ${v} ${className}`}>{children}</button>
}

function Chip({ label, dot = 'var(--green)' }: { label: string; dot?: string }) {
  const { t: translate } = useLanguage()
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-az-card border border-[var(--border)] text-[11px] text-az-text font-medium backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dot }} />
      {translate(label)}
    </div>
  )
}

function BrowserFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`az-browser-frame rounded-2xl border border-[var(--border)] overflow-hidden ${className}`}

    >
      <div
        className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--border)]"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-4 h-5 rounded-md bg-[var(--surface-highlight)] flex items-center justify-center">
          <span className="text-az-muted text-[10px]">🔒 app.aezcheck.com</span>
        </div>
      </div>
      {children}
    </div>
  )
}

function TableMockup({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const { t: translate } = useLanguage()
  const statusCell = (cell: string) => {
    if (cell === 'Active' || cell === 'Success')
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-az-green/15 text-az-green">
          {translate(cell)}
        </span>
      )
    if (cell === 'Warning')
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/15 text-yellow-400">
          {translate(cell)}
        </span>
      )
    if (cell === 'Inactive' || cell === 'None')
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--surface-highlight)] text-az-muted">
          {translate(cell)}
        </span>
      )
    return <span className="text-[11px] text-az-text">{translate(cell)}</span>
  }

  const isStatus = (cell: string) =>
    ['Active', 'Warning', 'Inactive', 'Success', 'None'].includes(cell)

  return (
    <div className="overflow-x-auto">
      <div className="az-table-scroll"><table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2.5 px-3 text-[var(--text-secondary)] font-medium text-[10px] uppercase tracking-wider whitespace-nowrap"
              >
                {translate(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--surface-highlight)] transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 px-3 text-[11px] whitespace-nowrap">
                  {isStatus(cell) ? statusCell(cell) : <span className="text-az-text">{translate(cell)}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  )
}

// ─── S4: Control Center ───────────────────────────────────────────────────────

function ControlCenter() {
  const { t: translate } = useLanguage()
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-16 items-center">
          <div>
            <Heading className="mb-8">{translate("Một màn hình để nhìn thấy ")}<Green>{translate("tình trạng toàn bộ hệ thống.")}</Green>
            </Heading>
            <ControlCenterBenefits />
          </div>
          <ControlCenterIllustrationStack />
        </div>
      </Container>
    </Section>
  )
}

// ─── S5: Asset Management ─────────────────────────────────────────────────────

const ASSET_DATA: Record<number, { headers: string[]; rows: string[][] }> = {
  0: {
    headers: ['VIA', 'Token', 'Hết hạn', '2FA', 'Quyền QC', 'BM liên kết', 'TKQC', 'Trạng thái'],
    rows: [
      ['VIA_001', 'Bearer eyJhbG...', '12 ngày', '✓ Bật', 'Đủ', 'BM #112', '8', 'Active'],
      ['VIA_002', 'Bearer xK8mJ...', '3 ngày', '✗ Tắt', 'Hạn chế', 'BM #118', '3', 'Warning'],
      ['VIA_003', 'Bearer pLx9A...', '28 ngày', '✓ Bật', 'Đủ', 'BM #112', '12', 'Active'],
      ['VIA_004', 'Bearer nRq2T...', '1 ngày', '✓ Bật', 'Đủ', 'BM #120', '6', 'Warning'],
    ],
  },
  1: {
    headers: ['Tài khoản', 'Hạn mức', 'Đã chi', 'Trạng thái', 'BM', 'VIA', 'Status'],
    rows: [
      ['TKQC #1182', '$5,000', '$1,200', 'Active', 'BM #112', 'VIA_001', 'Active'],
      ['TKQC #9834', '$3,000', '$2,890', 'Warning', 'BM #118', 'VIA_002', 'Warning'],
      ['TKQC #4421', '$10,000', '$4,300', 'Active', 'BM #112', 'VIA_003', 'Active'],
    ],
  },
  2: {
    headers: ['BM', 'Loại', 'TKQC', 'Fanpage', 'Status'],
    rows: [
      ['BM #112', 'Meta Business', '18', '32', 'Active'],
      ['BM #118', 'Meta Business', '6', '12', 'Warning'],
      ['BM #120', 'Meta Business', '4', '8', 'Active'],
    ],
  },
  3: {
    headers: ['Fanpage', 'Followers', 'Hoạt động', 'TKQC liên kết', 'Status'],
    rows: [
      ['AezCheck Official', '2.4M', 'Active', 'Linked', 'Active'],
      ['AezCheck Vietnam', '890K', 'Active', 'Linked', 'Active'],
      ['Test Page 01', '1.2K', 'Inactive', 'Unlinked', 'Inactive'],
    ],
  },
}

function AssetManagement() {
  const { t: translate } = useLanguage()
  const [tab, setTab] = useState(0)
  return (
    <Section>
      <Container>
        <div className="text-center mb-10">
          <Heading>{translate("VIA, TKQC, BM và Fanpage.")}<br />
            <Green>{translate("Tất cả ở đúng nơi của nó.")}</Green>
          </Heading>
        </div>
        <BrowserFrame>
          <div className="p-4">
            <div className="az-asset-tabs flex gap-1 mb-5">
              {['VIA', 'TKQC', 'BM', 'Fanpage'].map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(i)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === i ? 'bg-az-green text-[var(--on-accent)]' : 'text-az-muted hover:text-az-text hover:bg-[var(--surface-highlight)]'}`}
                >
                  {translate(t)}
                </button>
              ))}
            </div>
            <TableMockup headers={ASSET_DATA[tab].headers} rows={ASSET_DATA[tab].rows} />
          </div>
        </BrowserFrame>
      </Container>
    </Section>
  )
}

// ─── S6: Ads Management ───────────────────────────────────────────────────────

function AdsManagement() {
  const { t: translate } = useLanguage()
  const [tab, setTab] = useState(0)
  return (
    <Section>
      <Container>
        <div className="text-center mb-10">
          <Heading>{translate("Theo dõi và vận hành quảng cáo")}<br />
            <Green>{translate("mà không cần nhảy qua nhiều tài khoản.")}</Green>
          </Heading>
        </div>
        <BrowserFrame><AdsManagementPreview /></BrowserFrame>
      </Container>
    </Section>
  )
}

// ─── S7: Shield ───────────────────────────────────────────────────────────────

function Shield() {
  const { t: translate } = useLanguage()
  return <Section className="relative overflow-hidden">
    <Container className="relative">
      <div className="shield-section-heading text-center">
          <Heading>{translate("Không chỉ quản lý tài sản.")}<br />
            <Green>{translate("Hãy bảo vệ chúng.")}</Green>
          </Heading>
      </div>
      <ShieldIllustration />
    </Container>
  </Section>
}

function Workspace() {
  const { t: translate } = useLanguage()
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-14 items-center">
          <div>
            <Heading>{translate("Từ khách hàng đến TKQC thuê,")}{' '}
              <Green>{translate("mọi dòng tiền")}</Green>{translate(" và trách nhiệm đều có thể theo dõi.")}</Heading>
            <p className="mt-5 text-az-muted leading-relaxed text-sm">{translate("Workspace giúp bạn gán tài khoản cho đúng nhóm và khách hàng, theo dõi hạn mức chi tiêu, và hiểu rõ ai đang dùng tài sản nào.")}</p>
          </div>
          <BrowserFrame>
            <div className="p-5">
              {/* Flow */}
              <div className="flex flex-col gap-2 mb-5">
                {['Nhóm', 'Nhân sự', 'Khách hàng', 'TKQC thuê', 'Chi tiêu & Hạn mức'].map(
                  (step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-az-green/10 border border-az-green/20 flex items-center justify-center text-az-green text-[10px] font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div
                        className="az-ui-card flex-1 rounded-lg px-4 py-2 border border-[var(--border)]"

                      >
                        <span className="text-az-text text-xs font-medium">{translate(step)}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="border-t border-[var(--border)] pt-4">
                <TableMockup
                  headers={['Khách hàng', 'TKQC thuê', 'Hạn mức', 'Đã dùng', 'Còn lại']}
                  rows={[
                    ['Client ABC', 'TKQC #1182', '$5,000', '$1,200', '$3,800'],
                    ['Client XYZ', 'TKQC #9834', '$3,000', '$2,890', '$110'],
                    ['Internal', 'TKQC #4421', '$10,000', '$4,300', '$5,700'],
                  ]}
                />
              </div>
            </div>
          </BrowserFrame>
        </div>
      </Container>
    </Section>
  )
}

// ─── S9: Finance ──────────────────────────────────────────────────────────────

function Finance() {
  const { t: translate } = useLanguage()
  return (
    <Section>
      <Container>
        <div className="text-center mb-12">
          <Heading>{translate("Biết tiền đang đi đâu ")}<Green>{translate("trước khi nó trở thành vấn đề.")}</Green>
          </Heading>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { l: 'Total Spend', v: '$412,840', c: 'var(--green)', d: '+12.4% tuần này' },
            { l: 'Available Balance', v: '$28,300', c: 'var(--text-primary)', d: 'Cập nhật hôm nay' },
            { l: 'Cards Connected', v: '14', c: 'var(--cyan-accent)', d: '12 active' },
            { l: 'Payment Threshold', v: '$500', c: 'var(--green-soft)', d: 'Mức hiện tại' },
          ].map((m) => (
            <div key={m.l} className="az-ui-card bg-az-card border border-[var(--border)] rounded-2xl p-5">
              <div className="text-az-muted text-xs mb-2">{translate(m.l)}</div>
              <div className="font-bold text-2xl" style={{ color: m.c }}>
                {translate(m.v)}
              </div>
              <div className="text-az-muted text-xs mt-1">{translate(m.d)}</div>
            </div>
          ))}
        </div>
        <BrowserFrame>
          <div className="p-5">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="az-ui-card md:col-span-2 rounded-xl border border-[var(--border)] p-4" >
                <div className="text-xs text-az-muted mb-3">{translate("Chi tiêu theo ngày — 30 ngày")}</div>
                <svg viewBox="0 0 300 100" className="w-full h-24" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--green)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 C30,75 50,60 80,50 C110,40 130,55 160,45 C190,35 210,25 240,20 C260,16 280,22 300,18"
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,80 C30,75 50,60 80,50 C110,40 130,55 160,45 C190,35 210,25 240,20 C260,16 280,22 300,18 L300,100 L0,100Z"
                    fill="url(#fg1)"
                  />
                </svg>
              </div>
              <div
                className="az-ui-card rounded-xl border border-[var(--border)] p-4 flex flex-col items-center justify-center"

              >
                <div className="text-xs text-az-muted mb-3">{translate("Budget Usage")}</div>
                <svg viewBox="0 0 80 80" className="w-20 h-20">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="var(--surface)" strokeWidth="10" />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth="10"
                    strokeDasharray="132 188"
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                  <text x="40" y="38" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="bold">
                    70%
                  </text>
                  <text x="40" y="50" textAnchor="middle" fill="var(--text-secondary)" fontSize="7">{translate("Used")}</text>
                </svg>
                <div className="text-[10px] text-az-muted mt-1">{translate("$288K / $412K")}</div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </Container>
    </Section>
  )
}

// ─── S10: Team & Permission ───────────────────────────────────────────────────

function TeamPermission() {
  const { t: translate } = useLanguage()
  const roles = ['Admin', 'Media Buyer', 'CS']
  const modules = ['Assets', 'Ads', 'Finance', 'Shield']
  const perms: Record<string, Record<string, string>> = {
    Admin: { Assets: 'Full', Ads: 'Full', Finance: 'Full', Shield: 'Full' },
    'Media Buyer': { Assets: 'View', Ads: 'Full', Finance: 'View', Shield: 'View' },
    CS: { Assets: 'View', Ads: 'View', Finance: 'None', Shield: 'None' },
  }
  const permStyle = (p: string) => {
    if (p === 'Full') return 'bg-az-green/15 text-az-green'
    if (p === 'View') return 'bg-az-cyan/15 text-az-cyan'
    return 'bg-[var(--surface-highlight)] text-az-muted'
  }
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-14 items-center">
          <div>
            <Heading>{translate("Đúng người. ")}<Green>{translate("Đúng quyền.")}</Green>
              <br />{translate("Đúng phạm vi cần quản lý.")}</Heading>
            <p className="mt-5 text-az-muted leading-relaxed text-sm">{translate("Phân quyền chi tiết theo vai trò — từ Admin toàn quyền đến CS chỉ xem khách hàng. Mọi hành động đều được ghi nhật ký.")}</p>
          </div>
          <BrowserFrame>
            <div className="p-4">
              <div className="text-xs font-medium text-az-text mb-4">{translate("Ma trận phân quyền")}</div>
              <div className="az-table-scroll"><table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-[10px] text-az-muted font-medium uppercase">{translate("Vai trò")}</th>
                    {modules.map((m) => (
                      <th key={m} className="text-center py-2 px-3 text-[10px] text-az-muted font-medium uppercase">
                        {translate(m)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role} className="border-t border-[var(--border)]">
                      <td className="py-3 px-3 text-az-text text-xs font-medium">{translate(role)}</td>
                      {modules.map((m) => (
                        <td key={m} className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${permStyle(perms[role][m])}`}>
                            {translate(perms[role][m])}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
          </BrowserFrame>
        </div>
      </Container>
    </Section>
  )
}

// ─── S11: Activity History ────────────────────────────────────────────────────

function ActivityHistory() {
  const { t: translate } = useLanguage()
  return (
    <Section>
      <Container>
        <div className="text-center mb-10">
          <Heading>{translate("Biết ai đã làm gì.")}<br />
            <Green>{translate("Và điều gì đã thay đổi.")}</Green>
          </Heading>
        </div>
        <BrowserFrame>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-az-text">{translate("Lịch sử hoạt động hệ thống")}</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-[var(--surface-highlight)] text-az-muted text-xs hover:bg-[var(--surface-highlight)] transition-colors">{translate("Lọc module")}</button>
                <button className="px-3 py-1 rounded-lg bg-[var(--surface-highlight)] text-az-muted text-xs hover:bg-[var(--surface-highlight)] transition-colors">{translate("Xuất CSV")}</button>
              </div>
            </div>
            <div className="az-table-scroll"><table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Thời gian', 'Người dùng', 'Module', 'Hành động', 'Kết quả'].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-az-muted font-medium text-[10px] uppercase tracking-wider">
                      {translate(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['09:14:32', 'Nguyen Van A', 'VIA', 'Thêm VIA mới #892', 'Success'],
                  ['08:52:11', 'Tran Thi B', 'TKQC', 'Tắt TKQC #9834', 'Success'],
                  ['08:31:00', 'Le Van C', 'Finance', 'Cập nhật hạn mức $5,000', 'Success'],
                  ['07:55:47', 'Nguyen Van A', 'Shield', 'Bật bảo vệ Fanpage', 'Success'],
                  ['07:32:15', 'System', 'TKQC', 'Phát hiện bất thường #9834', 'Warning'],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--surface-highlight)] transition-colors">
                    <td className="py-2.5 px-3 text-az-muted text-[11px] font-mono">{translate(row[0])}</td>
                    <td className="py-2.5 px-3 text-az-text text-[11px]">{translate(row[1])}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-az-green/10 text-az-green text-[10px]">{translate(row[2])}</span>
                    </td>
                    <td className="py-2.5 px-3 text-az-text text-[11px]">{translate(row[3])}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${row[4] === 'Success' ? 'bg-az-green/15 text-az-green' : 'bg-yellow-500/15 text-yellow-400'}`}
                      >
                        {translate(row[4])}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        </BrowserFrame>
      </Container>
    </Section>
  )
}

// ─── S12: Benefits ────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    n: '01',
    title: 'Một nguồn dữ liệu',
    desc: 'Không còn nhiều bảng Excel, nhiều tab, nhiều dashboard. AezCheck là nguồn sự thật duy nhất.',
    c: 'var(--green)',
  },
  {
    n: '02',
    title: 'Phát hiện vấn đề sớm',
    desc: 'Nhận cảnh báo trước khi token hết hạn, tài khoản bị khóa hay ngân sách cạn kiệt.',
    c: 'var(--cyan-accent)',
  },
  {
    n: '03',
    title: 'Vận hành team rõ ràng',
    desc: 'Phân quyền theo vai trò, audit log đầy đủ — ai làm gì, khi nào, kết quả ra sao.',
    c: 'var(--green-soft)',
  },
  {
    n: '04',
    title: 'Mở rộng dễ hơn',
    desc: 'Thêm nhân sự, thêm tài khoản, thêm khách hàng mà không mất kiểm soát.',
    c: 'var(--green)',
  },
]

function Benefits() {
  const { t: translate } = useLanguage()
  return (
    <Section>
      <Container>
        <div className="text-center mb-14">
          <Heading>{translate("Ít thao tác thủ công hơn.")}<br />
            <Green>{translate("Nhiều quyền kiểm soát hơn.")}</Green>
          </Heading>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((b) => (
            <div key={b.n} className="benefit-glass-card relative">
              <div className="benefit-glass-number text-7xl font-black leading-none mb-4">
                {translate(b.n)}
              </div>
              <div className="benefit-glass-title text-lg font-bold mb-2">{translate(b.title)}</div>
              <p className="benefit-glass-description text-sm leading-relaxed">{translate(b.desc)}</p>
              <div className="benefit-glass-line mt-5 w-8 h-0.5 rounded-full" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

// ─── S13: Final CTA ───────────────────────────────────────────────────────────

function FinalCTA() {
  const { t: translate, locale } = useLanguage()
  const featuresDestination = landingNavItems.find(item => item.href === '#features')!.href
  return (
    <Section className="relative overflow-hidden">
      <Container className="relative text-center">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-az-text">{translate("Đưa toàn bộ vận hành quảng cáo")}<br />
          <Green>{translate("về một nơi.")}</Green>
        </h2>
        <p className="mt-6 text-az-muted text-lg max-w-lg mx-auto leading-relaxed">{translate("Hơn 500 team đang dùng AezCheck để kiểm soát quảng cáo Meta hiệu quả hơn mỗi ngày.")}</p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Btn href={landingExperienceDestination} className="text-base px-8 py-3.5">{translate("Bắt đầu trải nghiệm")}</Btn>
          <Btn href={localizedHref(featuresDestination, locale)} variant="outline" className="text-base px-8 py-3.5">{translate("Khám phá tính năng →")}</Btn>
        </div>
      </Container>
    </Section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { t: translate, locale } = useLanguage()
  const supportText = (text: string) => footerSupportCopy[locale][text] ?? translate(text)
  return (
    <footer
      className="py-16 px-6"
    >
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brand variant="footer" />
            </div>
            <p className="text-az-muted text-sm leading-relaxed max-w-xs">{translate("Control Center cho toàn bộ hệ thống quảng cáo Meta / Facebook của bạn.")}</p>
          </div>
          {[
            {
              title: 'AezCheck',
              links: landingFooterItems,
            },
            {
              title: 'Hỗ trợ',
              links: landingSupportItems,
            },
          ].map((col) => (
            <div key={col.title} className={col.title === 'Hỗ trợ' ? 'min-w-0 [overflow-wrap:anywhere]' : undefined}>
              <div className="text-az-text font-semibold text-sm mb-3">{col.title === 'Hỗ trợ' ? supportText(col.title) : translate(col.title)}</div>
              {col.links.map((l) => (
                <a
                  key={l.label}
                  href={localizedHref(l.href, locale)}
                  target={l.href === landingContactDestination ? '_blank' : undefined}
                  rel={l.href === landingContactDestination ? 'noopener noreferrer' : undefined}
                  className="flex items-center min-h-11 text-az-muted text-sm hover:text-az-text transition-colors"
                >
                  {col.title === 'Hỗ trợ' ? supportText(l.label) : translate(l.label)}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-az-muted text-xs">{translate("© 2026 AezCheck. All rights reserved.")}</span>
        </div>
      </Container>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { language } = useLanguage()
  const [location, setLocation] = useState(() => ({ hash: window.location.hash, pathname: window.location.pathname }))
  const { hash, pathname } = location
  const route = getSiteRoute(hash, pathname)
  const isPricing = route.page === 'pricing'
  const isGuide = route.page === 'guide'
  const legalPage = getLegalPage(hash, pathname)
  const isTerms = legalPage === 'terms'
  const isPrivacy = legalPage === 'privacy'
  useEffect(() => {
    const updateView = () => setLocation({ hash: window.location.hash, pathname: window.location.pathname })
    window.addEventListener('hashchange', updateView)
    window.addEventListener('popstate', updateView)
    return () => { window.removeEventListener('hashchange', updateView); window.removeEventListener('popstate', updateView) }
  }, [])
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (isGuide || ((isTerms || isPrivacy) && route.anchor)) return // Content pages own anchor scrolling.
      if (isPricing || isTerms || isPrivacy || isGuide) window.scrollTo({ top: 0, behavior: 'instant' })
      else if (hash.startsWith('#') && hash.length > 1) document.getElementById(hash.slice(1))?.scrollIntoView()
      else window.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, isPricing, isTerms, isPrivacy, isGuide, route.anchor])
  return (
    <div className="az-page" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      <LandingBackground />
      <PageMetadata page={route.page} locale={language} found={route.found} />
      <a className="az-skip-link" href="#page-content">{language === 'vi' ? 'Bỏ qua điều hướng' : 'Skip to content'}</a>
      <Navbar />
      <div id="page-content" tabIndex={-1}>
      {!route.found ? <main className="relative mx-auto max-w-4xl px-6 py-24"><h1 className="text-4xl font-bold">404 — {language === 'vi' ? 'Không tìm thấy trang' : 'Page not found'}</h1><a className="mt-8 inline-block text-az-green" href={`/${language}/`}>{language === 'vi' ? 'Về trang chủ' : 'Back to home'}</a></main> : isPricing ? <PricingPage /> : isTerms ? <TermsPage /> : isPrivacy ? <PrivacyPage /> : isGuide ? <Suspense fallback={<main role="status" style={{ minHeight: 'calc(100dvh - var(--header-height))', padding: '64px 24px', textAlign: 'center' }}>{language === 'vi' ? 'Đang tải hướng dẫn…' : 'Loading guide…'}</main>}><GuidePage /></Suspense> : <main>
      <Hero />
      <ProductEcosystemSection />
      <ChallengeSection />
      <FeatureSpotlight />
      <div id="control-center" className="az-section-anchor"><ControlCenter /></div>
      <div id="asset-management" className="az-section-anchor"><AssetManagement /></div>
      <AdsManagement />
      <div id="shield" className="az-section-anchor"><Shield /></div>
      <Workspace />
      <div id="finance" className="az-section-anchor"><Finance /></div>
      <TeamPermission />
      <ActivityHistory />
      <div id="benefits" className="az-section-anchor"><Benefits /></div>
      <div id="contact" className="az-section-anchor"><FinalCTA /></div>
      </main>}
      </div>
      <Footer />
    </div>
  )
}
