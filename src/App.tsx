import { ChallengeSection } from './components/ChallengeSection'
import { FeatureSpotlight } from './components/FeatureSpotlight'
import { ProductEcosystemSection } from './components/ProductEcosystemSection'
import { useLanguage } from './i18n/LanguageContext'
import { useState } from 'react'
import { Navbar, Hero } from './components/LandingOpening'
import { Brand } from './components/Brand'

// ─── Layout primitives ────────────────────────────────────────────────────────

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-[1200px] mx-auto ${className}`}>{children}</div>
}

function Section({
  children,
  className = '',
  bg,
}: {
  children: React.ReactNode
  className?: string
  bg?: string
}) {
  return (
    <section
      className={`py-24 px-6 ${className}`}
      style={bg ? { background: bg } : undefined}
    >
      {children}
    </section>
  )
}

// ─── Design system atoms ──────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-az-green/30 bg-az-green/10 text-az-green text-[11px] font-semibold tracking-[0.15em] uppercase">
      {children}
    </span>
  )
}

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
}: {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  className?: string
}) {
  const base =
    'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer'
  const v =
    variant === 'primary'
      ? 'bg-az-green text-[var(--on-accent)] hover:bg-az-bright'
      : 'border border-az-green/40 text-az-green hover:border-az-green hover:bg-az-green/10'
  return <button className={`${base} ${v} ${className}`}>{children}</button>
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
      style={{ background: 'var(--surface)' }}
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

function ControlDashboard() {
  const { t: translate } = useLanguage()
  return (
    <div className="p-4" style={{ minHeight: 320 }}>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { l: 'Live Accounts', v: '192', c: 'var(--green)' },
          { l: 'Campaigns', v: '847', c: 'var(--text-primary)' },
          { l: 'Active Ads', v: '3.2K', c: 'var(--cyan-accent)' },
          { l: 'Total Spend', v: '$412K', c: 'var(--green-soft)' },
        ].map((m) => (
          <div
            key={m.l}
            className="rounded-lg p-3 border border-[var(--border)]"
            style={{ background: 'var(--surface-soft)' }}
          >
            <div className="text-[8px] text-az-muted">{translate(m.l)}</div>
            <div className="text-base font-bold mt-1" style={{ color: m.c }}>
              {translate(m.v)}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--border)] p-4 mb-3" style={{ background: 'var(--surface-soft)' }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-az-text font-medium">{translate("Spend & Revenue — 30 ngày")}</span>
          <div className="flex gap-3 text-[9px] text-az-muted">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-az-green inline-block rounded" />{translate("Spend")}</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-az-cyan inline-block rounded" />{translate("Revenue")}</span>
          </div>
        </div>
        <svg viewBox="0 0 400 90" className="w-full h-20" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--green)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--cyan-accent)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--cyan-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,70 C50,65 80,52 120,42 C160,32 190,40 230,35 C270,30 300,18 350,12 C370,9 385,15 400,10"
            fill="none"
            stroke="var(--cyan-accent)"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <path
            d="M0,70 C50,65 80,52 120,42 C160,32 190,40 230,35 C270,30 300,18 350,12 C370,9 385,15 400,10 L400,90 L0,90Z"
            fill="url(#cg2)"
          />
          <path
            d="M0,75 C50,70 80,60 120,52 C160,44 190,53 230,47 C270,41 300,28 350,22 C370,18 385,24 400,19"
            fill="none"
            stroke="var(--green)"
            strokeWidth="2"
          />
          <path
            d="M0,75 C50,70 80,60 120,52 C160,44 190,53 230,47 C270,41 300,28 350,22 C370,18 385,24 400,19 L400,90 L0,90Z"
            fill="url(#cg1)"
          />
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: 'Risk Score', v: 'Low', c: 'var(--green)', bg: 'rgba(40,209,124,0.08)' },
          { l: 'Anomalies', v: '3 found', c: 'var(--warning)', bg: 'rgba(245,158,11,0.08)' },
          { l: 'Assets OK', v: '98.2%', c: 'var(--cyan-accent)', bg: 'rgba(61,224,209,0.08)' },
        ].map((r) => (
          <div
            key={r.l}
            className="rounded-lg p-2.5 border border-[var(--border)]"
            style={{ background: r.bg }}
          >
            <div className="text-[9px] text-az-muted">{translate(r.l)}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: r.c }}>
              {translate(r.v)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ControlCenter() {
  const { t: translate } = useLanguage()
  return (
    <Section bg="var(--bg-secondary)">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>{translate("Control Center")}</Eyebrow>
            <Heading className="mt-4 mb-8">{translate("Một màn hình để nhìn thấy ")}<Green>{translate("tình trạng toàn bộ hệ thống.")}</Green>
            </Heading>
            <div className="flex flex-col gap-1">
              {[
                {
                  n: '01',
                  title: 'Live Status',
                  desc: 'Xem trạng thái thực tế của từng tài khoản, từng VIA — không cần refresh thủ công.',
                },
                {
                  n: '02',
                  title: 'Trend Monitoring',
                  desc: 'Phát hiện xu hướng chi tiêu, hiệu suất và rủi ro trước khi chúng trở thành sự cố.',
                },
                {
                  n: '03',
                  title: 'Risk Overview',
                  desc: 'Tổng hợp cảnh báo và chỉ số nguy cơ trên một dashboard duy nhất.',
                },
                {
                  n: '04',
                  title: 'Asset Distribution',
                  desc: 'Phân bổ tài sản quảng cáo theo nhóm, nhân sự và khách hàng.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--surface-highlight)] transition-colors group cursor-default"
                >
                  <div className="w-9 h-9 rounded-lg bg-az-green/10 border border-az-green/20 flex items-center justify-center text-az-green text-xs font-bold flex-shrink-0 group-hover:bg-az-green/15">
                    {translate(f.n)}
                  </div>
                  <div>
                    <div className="font-semibold text-az-text text-sm">{translate(f.title)}</div>
                    <div className="text-az-muted text-xs mt-0.5 leading-relaxed">{translate(f.desc)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute -inset-8 rounded-3xl opacity-[0.14]"
              style={{
                background: 'radial-gradient(ellipse, var(--cyan-accent), transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <BrowserFrame>
              <ControlDashboard />
            </BrowserFrame>
          </div>
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
          <Eyebrow>{translate("Asset Management")}</Eyebrow>
          <Heading className="mt-4">{translate("VIA, TKQC, BM và Fanpage.")}<br />
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
    <Section bg="var(--bg-secondary)">
      <Container>
        <div className="text-center mb-10">
          <Eyebrow>{translate("Ads Management")}</Eyebrow>
          <Heading className="mt-4">{translate("Theo dõi và vận hành quảng cáo")}<br />
            <Green>{translate("mà không cần nhảy qua nhiều tài khoản.")}</Green>
          </Heading>
        </div>
        <BrowserFrame>
          <div
            className="az-ad-tabs border-b border-[var(--border)] px-4 flex gap-0"
            style={{ background: 'var(--bg-secondary)' }}
          >
            {['Tài khoản', 'Campaigns', 'Ad Sets', 'Ads'].map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${tab === i ? 'border-az-green text-az-green' : 'border-transparent text-az-muted hover:text-az-text'}`}
              >
                {translate(t)}
              </button>
            ))}
          </div>
          <div className="p-4">
            <TableMockup
              headers={['Tên', 'Trạng thái', 'Ngân sách', 'Reach', 'Impressions', 'Chi tiêu', 'Tags']}
              rows={[
                ['Campaign: Summer Sale', 'Active', '$1,000/ngày', '84.2K', '1.2M', '$12,400', 'brand, summer'],
                ['Campaign: Lead Gen Q3', 'Active', '$500/ngày', '42.1K', '890K', '$8,200', 'lead, q3'],
                ['Campaign: Retarget 90d', 'Warning', '$200/ngày', '18.4K', '320K', '$3,100', 'retarget'],
                ['Campaign: Brand Awareness', 'Inactive', '$0', '0', '0', '$0', 'brand'],
              ]}
            />
          </div>
        </BrowserFrame>
      </Container>
    </Section>
  )
}

// ─── S7: Shield ───────────────────────────────────────────────────────────────

function Shield() {
  const { t: translate } = useLanguage()
  const labels = ['Website', 'Fanpage', 'Budget', 'Keyword', 'Country', 'Suspicious Activity']
  return (
    <Section
      className="relative overflow-hidden"
      bg="var(--surface-soft)"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(40,209,124,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 35% 35% at 50% 50%, rgba(61,224,209,0.05) 0%, transparent 60%)',
          }}
        />
      </div>
      <Container className="relative">
        <div className="text-center mb-16">
          <Eyebrow>{translate("Shield")}</Eyebrow>
          <Heading className="mt-4">{translate("Không chỉ quản lý tài sản.")}<br />
            <Green>{translate("Hãy bảo vệ chúng.")}</Green>
          </Heading>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-full border border-az-green/10" />
            <div className="absolute inset-6 rounded-full border border-az-green/15" />
            <div className="absolute inset-14 rounded-full border border-az-green/20" />
            {/* Center shield */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-az-green/15 border-2 border-az-green/50 flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-az-green/10">
                <svg
                  className="w-8 h-8 text-az-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-az-green text-[9px] font-bold tracking-widest">{translate("PROTECTED")}</span>
              </div>
            </div>
            {/* Orbital labels */}
            {labels.map((label, i) => {
              const angle = (i / labels.length) * 360 - 90
              const rad = (angle * Math.PI) / 180
              const r = 135
              const cx = 144
              const cy = 144
              const x = Math.cos(rad) * r + cx
              const y = Math.sin(rad) * r + cy
              return (
                <div
                  key={label}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: x, top: y }}
                >
                  <div className="px-2.5 py-1 rounded-full bg-az-card border border-az-green/30 text-az-green text-[10px] font-medium whitespace-nowrap shadow-sm">
                    {translate(label)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-az-green/15 border border-az-green/40">
            <span className="w-2 h-2 rounded-full bg-az-green animate-pulse" />
            <span className="text-az-green font-semibold text-sm">{translate("Hệ thống đang được bảo vệ — PROTECTED")}</span>
          </div>
        </div>
      </Container>
    </Section>
  )
}

// ─── S8: Workspace ────────────────────────────────────────────────────────────

function Workspace() {
  const { t: translate } = useLanguage()
  return (
    <Section>
      <Container>
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>{translate("Client Workspace")}</Eyebrow>
            <Heading className="mt-4">{translate("Từ khách hàng đến TKQC thuê,")}{' '}
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
                        className="flex-1 rounded-lg px-4 py-2 border border-[var(--border)]"
                        style={{ background: 'var(--surface-soft)' }}
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
    <Section bg="var(--bg-secondary)">
      <Container>
        <div className="text-center mb-12">
          <Eyebrow>{translate("Finance")}</Eyebrow>
          <Heading className="mt-4">{translate("Biết tiền đang đi đâu ")}<Green>{translate("trước khi nó trở thành vấn đề.")}</Green>
          </Heading>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { l: 'Total Spend', v: '$412,840', c: 'var(--green)', d: '+12.4% tuần này' },
            { l: 'Available Balance', v: '$28,300', c: 'var(--text-primary)', d: 'Cập nhật hôm nay' },
            { l: 'Cards Connected', v: '14', c: 'var(--cyan-accent)', d: '12 active' },
            { l: 'Payment Threshold', v: '$500', c: 'var(--green-soft)', d: 'Mức hiện tại' },
          ].map((m) => (
            <div key={m.l} className="bg-az-card border border-[var(--border)] rounded-2xl p-5">
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
              <div className="md:col-span-2 rounded-xl border border-[var(--border)] p-4" style={{ background: 'var(--surface-soft)' }}>
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
                className="rounded-xl border border-[var(--border)] p-4 flex flex-col items-center justify-center"
                style={{ background: 'var(--surface-soft)' }}
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
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>{translate("Team & Permission")}</Eyebrow>
            <Heading className="mt-4">{translate("Đúng người. ")}<Green>{translate("Đúng quyền.")}</Green>
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
    <Section bg="var(--bg-secondary)">
      <Container>
        <div className="text-center mb-10">
          <Eyebrow>{translate("Activity Log")}</Eyebrow>
          <Heading className="mt-4">{translate("Biết ai đã làm gì.")}<br />
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
          <Eyebrow>{translate("Lợi ích")}</Eyebrow>
          <Heading className="mt-4">{translate("Ít thao tác thủ công hơn.")}<br />
            <Green>{translate("Nhiều quyền kiểm soát hơn.")}</Green>
          </Heading>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((b) => (
            <div key={b.n} className="relative">
              <div className="text-7xl font-black opacity-[0.06] leading-none mb-4" style={{ color: b.c }}>
                {translate(b.n)}
              </div>
              <div className="text-lg font-bold text-az-text mb-2">{translate(b.title)}</div>
              <p className="text-az-muted text-sm leading-relaxed">{translate(b.desc)}</p>
              <div className="mt-5 w-8 h-0.5 rounded-full" style={{ background: b.c }} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

// ─── S13: Final CTA ───────────────────────────────────────────────────────────

function FinalCTA() {
  const { t: translate } = useLanguage()
  return (
    <Section className="relative overflow-hidden" bg="var(--surface-soft)">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 110%, rgba(40,209,124,0.1) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(40,209,124,0.6) 39px, rgba(40,209,124,0.6) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(40,209,124,0.6) 39px, rgba(40,209,124,0.6) 40px)',
          }}
        />
      </div>
      <Container className="relative text-center">
        <Eyebrow>{translate("Bắt đầu ngay hôm nay")}</Eyebrow>
        <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-az-text">{translate("Đưa toàn bộ vận hành quảng cáo")}<br />
          <Green>{translate("về một nơi.")}</Green>
        </h2>
        <p className="mt-6 text-az-muted text-lg max-w-lg mx-auto leading-relaxed">{translate("Hơn 500 team đang dùng AezCheck để kiểm soát quảng cáo Meta hiệu quả hơn mỗi ngày.")}</p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Btn className="text-base px-8 py-3.5">{translate("Bắt đầu trải nghiệm")}</Btn>
          <Btn variant="outline" className="text-base px-8 py-3.5">{translate("Khám phá tính năng →")}</Btn>
        </div>
      </Container>
    </Section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { t: translate } = useLanguage()
  return (
    <footer
      className="border-t border-[var(--border)] py-16 px-6"
      style={{ background: 'var(--surface-soft)' }}
    >
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brand variant="footer" />
            </div>
            <p className="text-az-muted text-sm leading-relaxed max-w-xs">{translate("Control Center cho toàn bộ hệ thống quảng cáo Meta / Facebook của bạn.")}</p>
          </div>
          {[
            {
              title: 'Sản phẩm',
              links: ['Control Center', 'Asset Management', 'Ads Manager', 'Shield'],
            },
            {
              title: 'Giải pháp',
              links: ['Agency', 'Media Buyer', 'Enterprise', 'Freelancer'],
            },
            {
              title: 'Hỗ trợ',
              links: ['Documentation', 'Changelog', 'Status', 'Contact'],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-az-text font-semibold text-sm mb-3">{translate(col.title)}</div>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-az-muted text-sm hover:text-az-text transition-colors mb-2"
                >
                  {translate(l)}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-az-muted text-xs">{translate("© 2026 AezCheck. All rights reserved.")}</span>
          <div className="flex gap-6">
            {['Terms', 'Privacy'].map((l) => (
              <a key={l} href="#" className="text-az-muted text-xs hover:text-az-text transition-colors">
                {translate(l)}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="az-page" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
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
      <Footer />
    </div>
  )
}
