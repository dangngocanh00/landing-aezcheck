import { useState } from 'react'

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
      ? 'bg-az-green text-az-security hover:bg-az-bright'
      : 'border border-az-green/40 text-az-green hover:border-az-green hover:bg-az-green/10'
  return <button className={`${base} ${v} ${className}`}>{children}</button>
}

function Chip({ label, dot = '#28D17C' }: { label: string; dot?: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-az-card border border-white/10 text-[11px] text-az-text font-medium backdrop-blur-sm">
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dot }} />
      {label}
    </div>
  )
}

function BrowserFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl ${className}`}
      style={{ background: '#0E1E1A' }}
    >
      <div
        className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]"
        style={{ background: '#0B1714' }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-4 h-5 rounded-md bg-white/5 flex items-center justify-center">
          <span className="text-az-muted text-[10px]">🔒 app.aezcheck.com</span>
        </div>
      </div>
      {children}
    </div>
  )
}

function TableMockup({ headers, rows }: { headers: string[]; rows: string[][] }) {
  const statusCell = (cell: string) => {
    if (cell === 'Active' || cell === 'Success')
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-az-green/15 text-az-green">
          {cell}
        </span>
      )
    if (cell === 'Warning')
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/15 text-yellow-400">
          {cell}
        </span>
      )
    if (cell === 'Inactive' || cell === 'None')
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-az-muted">
          {cell}
        </span>
      )
    return <span className="text-[11px] text-az-text">{cell}</span>
  }

  const isStatus = (cell: string) =>
    ['Active', 'Warning', 'Inactive', 'Success', 'None'].includes(cell)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.08]">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2.5 px-3 text-[#9FB0AA] font-medium text-[10px] uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 px-3 text-[11px] whitespace-nowrap">
                  {isStatus(cell) ? statusCell(cell) : <span className="text-az-text">{cell}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Dashboard mockup (Hero) ──────────────────────────────────────────────────

function HeroDashboard() {
  return (
    <BrowserFrame>
      <div className="flex" style={{ height: 460 }}>
        {/* Sidebar */}
        <div
          className="w-12 flex flex-col items-center py-4 gap-3 border-r border-white/[0.05] flex-shrink-0"
          style={{ background: '#040907' }}
        >
          <div className="w-7 h-7 rounded-lg bg-az-green flex items-center justify-center text-az-security font-black text-[9px]">
            AZ
          </div>
          {[
            <svg key="a" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.5" /></svg>,
            <svg key="b" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="1.5" /><circle cx="9" cy="7" r="4" strokeWidth="1.5" /></svg>,
            <svg key="c" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" strokeWidth="1.5" /></svg>,
            <svg key="d" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" /></svg>,
          ].map((icon, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${i === 0 ? 'bg-az-green/15 text-az-green' : 'text-az-muted'}`}
            >
              {icon}
            </div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05]"
            style={{ background: '#0B1714' }}
          >
            <span className="text-[10px] font-semibold text-az-text">Control Center</span>
            <div className="flex items-center gap-2">
              <div className="px-1.5 py-0.5 rounded bg-az-green/15 text-az-green text-[9px] font-medium">
                ● Live
              </div>
              <div className="w-5 h-5 rounded-full bg-az-green/20 text-az-green text-[9px] flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 p-3">
            {[
              { l: 'VIA Active', v: '128', c: '#28D17C' },
              { l: 'TKQC Linked', v: '64', c: '#F5F7F6' },
              { l: 'BM Online', v: '12', c: '#3DE0D1' },
              { l: 'Chi tiêu hôm nay', v: '$24.8K', c: '#77F1B1' },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-lg p-2 border border-white/[0.05]"
                style={{ background: '#040907' }}
              >
                <div className="text-[8px] text-az-muted">{s.l}</div>
                <div className="text-sm font-bold mt-0.5" style={{ color: s.c }}>
                  {s.v}
                </div>
              </div>
            ))}
          </div>
          {/* Body */}
          <div className="flex gap-2 px-3 flex-1 min-h-0 pb-3">
            {/* Left */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div
                className="rounded-xl border border-white/[0.05] p-3 flex-1"
                style={{ background: '#040907' }}
              >
                <div className="text-[9px] text-az-muted mb-2">Chi tiêu 14 ngày qua</div>
                <svg viewBox="0 0 220 70" className="w-full h-16" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#28D17C" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#28D17C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,55 C20,52 35,44 55,37 C75,30 85,43 105,32 C125,21 135,28 155,18 C170,11 185,19 210,10 L220,8"
                    fill="none"
                    stroke="#28D17C"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0,55 C20,52 35,44 55,37 C75,30 85,43 105,32 C125,21 135,28 155,18 C170,11 185,19 210,10 L220,8 L220,70 L0,70Z"
                    fill="url(#hg1)"
                  />
                </svg>
              </div>
              <div
                className="rounded-xl border border-white/[0.05] p-2"
                style={{ background: '#040907' }}
              >
                <div className="text-[8px] text-az-muted mb-1.5">Tài khoản gần đây</div>
                {[
                  { name: 'TKQC #1182', status: 'Active', spend: '$1.2K', ok: true },
                  { name: 'TKQC #9834', status: 'Warning', spend: '$890', ok: false },
                  { name: 'TKQC #4421', status: 'Active', spend: '$2.1K', ok: true },
                ].map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center gap-2 py-1 border-b border-white/[0.04] last:border-0"
                  >
                    <span className="text-[9px] text-az-text flex-1">{a.name}</span>
                    <span className={`text-[8px] ${a.ok ? 'text-az-green' : 'text-yellow-400'}`}>
                      ● {a.status}
                    </span>
                    <span className="text-[9px] text-az-muted w-10 text-right">{a.spend}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right */}
            <div className="w-24 flex flex-col gap-2 flex-shrink-0">
              <div
                className="rounded-xl border border-white/[0.05] p-2 flex flex-col items-center"
                style={{ background: '#040907' }}
              >
                <div className="text-[8px] text-az-muted mb-1 self-start">Phân bổ</div>
                <svg viewBox="0 0 60 60" className="w-12 h-12">
                  <circle cx="30" cy="30" r="20" fill="none" stroke="#0E1E1A" strokeWidth="9" />
                  <circle
                    cx="30"
                    cy="30"
                    r="20"
                    fill="none"
                    stroke="#28D17C"
                    strokeWidth="9"
                    strokeDasharray="75 125"
                    transform="rotate(-90 30 30)"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="20"
                    fill="none"
                    stroke="#3DE0D1"
                    strokeWidth="9"
                    strokeDasharray="38 125"
                    strokeDashoffset="-75"
                    transform="rotate(-90 30 30)"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="20"
                    fill="none"
                    stroke="#77F1B1"
                    strokeWidth="9"
                    strokeDasharray="12 125"
                    strokeDashoffset="-113"
                    transform="rotate(-90 30 30)"
                  />
                </svg>
                {[
                  ['#28D17C', 'VIA 60%'],
                  ['#3DE0D1', 'TKQC 30%'],
                  ['#77F1B1', 'BM 10%'],
                ].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1 self-start">
                    <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: c }} />
                    <span className="text-[8px] text-az-muted">{l}</span>
                  </div>
                ))}
              </div>
              <div
                className="rounded-xl border border-white/[0.05] p-2 flex-1"
                style={{ background: '#040907' }}
              >
                <div className="text-[8px] text-az-muted mb-2">Cảnh báo</div>
                {[
                  { l: 'Cao', n: 2, c: '#ef4444' },
                  { l: 'Trung bình', n: 5, c: '#f59e0b' },
                  { l: 'Thấp', n: 18, c: '#28D17C' },
                ].map((r) => (
                  <div key={r.l} className="mb-2">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[8px]" style={{ color: r.c }}>
                        ● {r.l}
                      </span>
                      <span className="text-[8px] text-az-muted">{r.n}</span>
                    </div>
                    <div className="h-0.5 rounded-full bg-white/5">
                      <div
                        className="h-0.5 rounded-full"
                        style={{ background: r.c, width: `${(r.n / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]"
      style={{ background: 'rgba(7,17,15,0.88)', backdropFilter: 'blur(14px)' }}
    >
      <Container className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-az-green flex items-center justify-center text-az-security font-black text-xs">
            AZ
          </div>
          <span className="font-bold text-az-text tracking-tight">AezCheck</span>
        </div>
        <div className="hidden md:flex items-center gap-7">
          {['Sản phẩm', 'Tính năng', 'Shield', 'Giải pháp', 'Bảng giá'].map((item) => (
            <a key={item} href="#" className="text-az-muted hover:text-az-text text-sm transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="text-az-muted hover:text-az-text text-sm transition-colors">Đăng nhập</button>
          <Btn>Bắt đầu trải nghiệm</Btn>
        </div>
        <button className="md:hidden text-az-muted" onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </Container>
      {open && (
        <div
          className="md:hidden border-t border-white/[0.06] px-6 py-4 flex flex-col gap-4"
          style={{ background: '#0B1714' }}
        >
          {['Sản phẩm', 'Tính năng', 'Shield', 'Giải pháp', 'Bảng giá', 'Đăng nhập'].map((item) => (
            <a key={item} href="#" className="text-az-muted text-sm">
              {item}
            </a>
          ))}
          <Btn className="w-full justify-center">Bắt đầu trải nghiệm</Btn>
        </div>
      )}
    </nav>
  )
}

// ─── S1: Hero ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <Section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.09]"
          style={{ background: 'radial-gradient(circle, #28D17C, transparent 70%)', filter: 'blur(70px)' }}
        />
        <div
          className="absolute top-1/3 right-[10%] w-80 h-80 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #3DE0D1, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          <div>
            <Eyebrow>AEZCHECK CONTROL CENTER</Eyebrow>
            <h1 className="mt-6 text-5xl md:text-6xl font-black leading-[1.05] tracking-tight text-az-text">
              Quản lý <Green>toàn bộ hệ thống quảng cáo</Green> trên một nền tảng duy nhất.
            </h1>
            <p className="mt-6 text-az-muted text-lg leading-relaxed max-w-lg">
              AezCheck giúp bạn tập trung VIA, tài khoản quảng cáo, BM, Fanpage, chiến dịch, khách hàng và dữ liệu vận hành vào một Control Center duy nhất.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn className="text-base px-6 py-3">Bắt đầu trải nghiệm</Btn>
              <Btn variant="outline" className="text-base px-6 py-3">
                Khám phá AezCheck →
              </Btn>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              <Chip label="VIA • Active" dot="#28D17C" />
              <Chip label="TKQC • Connected" dot="#3DE0D1" />
              <Chip label="BM • Online" dot="#77F1B1" />
              <Chip label="Shield • Protected" dot="#3DE0D1" />
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-3xl opacity-[0.18]"
              style={{
                background: 'radial-gradient(ellipse, #28D17C, transparent 70%)',
                filter: 'blur(35px)',
              }}
            />
            <HeroDashboard />
          </div>
        </div>
      </Container>
    </Section>
  )
}

// ─── S2: Ecosystem ────────────────────────────────────────────────────────────

function Ecosystem() {
  const nodes = ['VIA', 'BM', 'TKQC', 'Campaign', 'Ads', 'Customer', 'Spend']
  return (
    <Section bg="#0B1714">
      <Container>
        <div className="text-center mb-14">
          <Heading>
            Không chỉ kiểm tra tài khoản.
            <br />
            <Green>AezCheck kết nối</Green> toàn bộ quy trình vận hành.
          </Heading>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-0">
          {nodes.map((node, i) => (
            <div key={node} className="flex items-center">
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border flex items-center justify-center font-bold text-sm ${
                  i === 0
                    ? 'bg-az-green/15 border-az-green/50 text-az-green'
                    : i === nodes.length - 1
                      ? 'bg-az-cyan/15 border-az-cyan/50 text-az-cyan'
                      : 'bg-az-card border-white/10 text-az-text'
                }`}
              >
                {node}
              </div>
              {i < nodes.length - 1 && (
                <div className="flex items-center mx-1 md:mx-2">
                  <div className="w-5 md:w-8 h-px bg-gradient-to-r from-az-green/40 to-az-cyan/40" />
                  <svg
                    className="w-3 h-3 text-az-green/60 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-az-muted mt-10 text-sm max-w-lg mx-auto">
          Toàn bộ quy trình quảng cáo trong một hệ thống — không cần chuyển tab, không mất dữ liệu.
        </p>
      </Container>
    </Section>
  )
}

// ─── S3: Pain Points ──────────────────────────────────────────────────────────

const PAINS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 10h16M4 14h8M4 18h8" />
        <circle cx="17" cy="17" r="4" strokeWidth="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h4" />
      </svg>
    ),
    title: 'Tài sản nằm rải rác',
    desc: 'VIA, BM, TKQC và Fanpage nằm ở nhiều nơi khác nhau. Không có bức tranh toàn cảnh nào để nhìn vào.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Không biết vấn đề xảy ra khi nào',
    desc: 'Tài khoản bị khóa, token hết hạn, ngân sách hết — bạn biết sau khi đã trễ.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Dữ liệu vận hành khó đối chiếu',
    desc: 'Spreadsheet, dashboard Meta, báo cáo nội bộ — ba nơi, ba con số khác nhau.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
    title: 'Team càng lớn càng khó kiểm soát',
    desc: 'Không có phân quyền rõ ràng, không có audit log — ai làm gì, ai có quyền gì đều mờ.',
  },
]

function PainPoints() {
  return (
    <Section>
      <Container>
        <div className="text-center mb-14">
          <Eyebrow>Vấn đề thực tế</Eyebrow>
          <Heading className="mt-4">
            Quản lý quảng cáo càng nhiều,
            <br />
            <span className="text-red-400">mọi thứ càng dễ mất kiểm soát.</span>
          </Heading>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PAINS.map((p) => (
            <div
              key={p.title}
              className="bg-az-card border border-white/[0.07] rounded-2xl p-6 hover:border-az-green/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:bg-az-green/10 group-hover:border-az-green/30 group-hover:text-az-green transition-all">
                {p.icon}
              </div>
              <h3 className="font-bold text-az-text mb-2 text-sm">{p.title}</h3>
              <p className="text-az-muted text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          {['Spreadsheet', 'Meta Business Suite', 'Báo cáo nội bộ', 'Zalo / Sheet'].map((t) => (
            <div
              key={t}
              className="px-3 py-1.5 rounded-lg bg-az-card border border-white/[0.06] text-az-muted text-xs"
            >
              {t}
            </div>
          ))}
          <svg className="w-7 h-7 text-az-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="px-4 py-2 rounded-xl bg-az-green/15 border border-az-green/40 text-az-green font-bold text-sm">
            AezCheck
          </div>
        </div>
      </Container>
    </Section>
  )
}

// ─── S4: Control Center ───────────────────────────────────────────────────────

function ControlDashboard() {
  return (
    <div className="p-4" style={{ minHeight: 320 }}>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { l: 'Live Accounts', v: '192', c: '#28D17C' },
          { l: 'Campaigns', v: '847', c: '#F5F7F6' },
          { l: 'Active Ads', v: '3.2K', c: '#3DE0D1' },
          { l: 'Total Spend', v: '$412K', c: '#77F1B1' },
        ].map((m) => (
          <div
            key={m.l}
            className="rounded-lg p-3 border border-white/[0.05]"
            style={{ background: '#040907' }}
          >
            <div className="text-[8px] text-az-muted">{m.l}</div>
            <div className="text-base font-bold mt-1" style={{ color: m.c }}>
              {m.v}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.05] p-4 mb-3" style={{ background: '#040907' }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-az-text font-medium">Spend & Revenue — 30 ngày</span>
          <div className="flex gap-3 text-[9px] text-az-muted">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-az-green inline-block rounded" />
              Spend
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-az-cyan inline-block rounded" />
              Revenue
            </span>
          </div>
        </div>
        <svg viewBox="0 0 400 90" className="w-full h-20" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#28D17C" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#28D17C" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3DE0D1" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#3DE0D1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,70 C50,65 80,52 120,42 C160,32 190,40 230,35 C270,30 300,18 350,12 C370,9 385,15 400,10"
            fill="none"
            stroke="#3DE0D1"
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
            stroke="#28D17C"
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
          { l: 'Risk Score', v: 'Low', c: '#28D17C', bg: 'rgba(40,209,124,0.08)' },
          { l: 'Anomalies', v: '3 found', c: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { l: 'Assets OK', v: '98.2%', c: '#3DE0D1', bg: 'rgba(61,224,209,0.08)' },
        ].map((r) => (
          <div
            key={r.l}
            className="rounded-lg p-2.5 border border-white/[0.05]"
            style={{ background: r.bg }}
          >
            <div className="text-[9px] text-az-muted">{r.l}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: r.c }}>
              {r.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ControlCenter() {
  return (
    <Section bg="#0B1714">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>Control Center</Eyebrow>
            <Heading className="mt-4 mb-8">
              Một màn hình để nhìn thấy <Green>tình trạng toàn bộ hệ thống.</Green>
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
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-default"
                >
                  <div className="w-9 h-9 rounded-lg bg-az-green/10 border border-az-green/20 flex items-center justify-center text-az-green text-xs font-bold flex-shrink-0 group-hover:bg-az-green/15">
                    {f.n}
                  </div>
                  <div>
                    <div className="font-semibold text-az-text text-sm">{f.title}</div>
                    <div className="text-az-muted text-xs mt-0.5 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute -inset-8 rounded-3xl opacity-[0.14]"
              style={{
                background: 'radial-gradient(ellipse, #3DE0D1, transparent 70%)',
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
  const [tab, setTab] = useState(0)
  return (
    <Section>
      <Container>
        <div className="text-center mb-10">
          <Eyebrow>Asset Management</Eyebrow>
          <Heading className="mt-4">
            VIA, TKQC, BM và Fanpage.
            <br />
            <Green>Tất cả ở đúng nơi của nó.</Green>
          </Heading>
        </div>
        <BrowserFrame>
          <div className="p-4">
            <div className="flex gap-1 mb-5">
              {['VIA', 'TKQC', 'BM', 'Fanpage'].map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(i)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === i ? 'bg-az-green text-az-security' : 'text-az-muted hover:text-az-text hover:bg-white/[0.05]'}`}
                >
                  {t}
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
  const [tab, setTab] = useState(0)
  return (
    <Section bg="#0B1714">
      <Container>
        <div className="text-center mb-10">
          <Eyebrow>Ads Management</Eyebrow>
          <Heading className="mt-4">
            Theo dõi và vận hành quảng cáo
            <br />
            <Green>mà không cần nhảy qua nhiều tài khoản.</Green>
          </Heading>
        </div>
        <BrowserFrame>
          <div
            className="border-b border-white/[0.06] px-4 flex gap-0"
            style={{ background: '#0B1714' }}
          >
            {['Tài khoản', 'Campaigns', 'Ad Sets', 'Ads'].map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${tab === i ? 'border-az-green text-az-green' : 'border-transparent text-az-muted hover:text-az-text'}`}
              >
                {t}
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
  const labels = ['Website', 'Fanpage', 'Budget', 'Keyword', 'Country', 'Suspicious Activity']
  return (
    <Section
      className="relative overflow-hidden"
      bg="#040907"
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
          <Eyebrow>Shield</Eyebrow>
          <Heading className="mt-4">
            Không chỉ quản lý tài sản.
            <br />
            <Green>Hãy bảo vệ chúng.</Green>
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
                <span className="text-az-green text-[9px] font-bold tracking-widest">PROTECTED</span>
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
                    {label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-az-green/15 border border-az-green/40">
            <span className="w-2 h-2 rounded-full bg-az-green animate-pulse" />
            <span className="text-az-green font-semibold text-sm">
              Hệ thống đang được bảo vệ — PROTECTED
            </span>
          </div>
        </div>
      </Container>
    </Section>
  )
}

// ─── S8: Workspace ────────────────────────────────────────────────────────────

function Workspace() {
  return (
    <Section>
      <Container>
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>Client Workspace</Eyebrow>
            <Heading className="mt-4">
              Từ khách hàng đến TKQC thuê,{' '}
              <Green>mọi dòng tiền</Green> và trách nhiệm đều có thể theo dõi.
            </Heading>
            <p className="mt-5 text-az-muted leading-relaxed text-sm">
              Workspace giúp bạn gán tài khoản cho đúng nhóm và khách hàng, theo dõi hạn mức chi tiêu, và hiểu rõ ai đang dùng tài sản nào.
            </p>
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
                        className="flex-1 rounded-lg px-4 py-2 border border-white/[0.05]"
                        style={{ background: '#040907' }}
                      >
                        <span className="text-az-text text-xs font-medium">{step}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="border-t border-white/[0.06] pt-4">
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
  return (
    <Section bg="#0B1714">
      <Container>
        <div className="text-center mb-12">
          <Eyebrow>Finance</Eyebrow>
          <Heading className="mt-4">
            Biết tiền đang đi đâu <Green>trước khi nó trở thành vấn đề.</Green>
          </Heading>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { l: 'Total Spend', v: '$412,840', c: '#28D17C', d: '+12.4% tuần này' },
            { l: 'Available Balance', v: '$28,300', c: '#F5F7F6', d: 'Cập nhật hôm nay' },
            { l: 'Cards Connected', v: '14', c: '#3DE0D1', d: '12 active' },
            { l: 'Payment Threshold', v: '$500', c: '#77F1B1', d: 'Mức hiện tại' },
          ].map((m) => (
            <div key={m.l} className="bg-az-card border border-white/[0.07] rounded-2xl p-5">
              <div className="text-az-muted text-xs mb-2">{m.l}</div>
              <div className="font-bold text-2xl" style={{ color: m.c }}>
                {m.v}
              </div>
              <div className="text-az-muted text-xs mt-1">{m.d}</div>
            </div>
          ))}
        </div>
        <BrowserFrame>
          <div className="p-5">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 rounded-xl border border-white/[0.05] p-4" style={{ background: '#040907' }}>
                <div className="text-xs text-az-muted mb-3">Chi tiêu theo ngày — 30 ngày</div>
                <svg viewBox="0 0 300 100" className="w-full h-24" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#28D17C" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#28D17C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 C30,75 50,60 80,50 C110,40 130,55 160,45 C190,35 210,25 240,20 C260,16 280,22 300,18"
                    fill="none"
                    stroke="#28D17C"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,80 C30,75 50,60 80,50 C110,40 130,55 160,45 C190,35 210,25 240,20 C260,16 280,22 300,18 L300,100 L0,100Z"
                    fill="url(#fg1)"
                  />
                </svg>
              </div>
              <div
                className="rounded-xl border border-white/[0.05] p-4 flex flex-col items-center justify-center"
                style={{ background: '#040907' }}
              >
                <div className="text-xs text-az-muted mb-3">Budget Usage</div>
                <svg viewBox="0 0 80 80" className="w-20 h-20">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#0E1E1A" strokeWidth="10" />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke="#28D17C"
                    strokeWidth="10"
                    strokeDasharray="132 188"
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                  <text x="40" y="38" textAnchor="middle" fill="#F5F7F6" fontSize="12" fontWeight="bold">
                    70%
                  </text>
                  <text x="40" y="50" textAnchor="middle" fill="#9FB0AA" fontSize="7">
                    Used
                  </text>
                </svg>
                <div className="text-[10px] text-az-muted mt-1">$288K / $412K</div>
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
    return 'bg-white/5 text-az-muted'
  }
  return (
    <Section>
      <Container>
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>Team & Permission</Eyebrow>
            <Heading className="mt-4">
              Đúng người. <Green>Đúng quyền.</Green>
              <br />
              Đúng phạm vi cần quản lý.
            </Heading>
            <p className="mt-5 text-az-muted leading-relaxed text-sm">
              Phân quyền chi tiết theo vai trò — từ Admin toàn quyền đến CS chỉ xem khách hàng. Mọi hành động đều được ghi nhật ký.
            </p>
          </div>
          <BrowserFrame>
            <div className="p-4">
              <div className="text-xs font-medium text-az-text mb-4">Ma trận phân quyền</div>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3 text-[10px] text-az-muted font-medium uppercase">
                      Vai trò
                    </th>
                    {modules.map((m) => (
                      <th key={m} className="text-center py-2 px-3 text-[10px] text-az-muted font-medium uppercase">
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role} className="border-t border-white/[0.05]">
                      <td className="py-3 px-3 text-az-text text-xs font-medium">{role}</td>
                      {modules.map((m) => (
                        <td key={m} className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${permStyle(perms[role][m])}`}>
                            {perms[role][m]}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BrowserFrame>
        </div>
      </Container>
    </Section>
  )
}

// ─── S11: Activity History ────────────────────────────────────────────────────

function ActivityHistory() {
  return (
    <Section bg="#0B1714">
      <Container>
        <div className="text-center mb-10">
          <Eyebrow>Activity Log</Eyebrow>
          <Heading className="mt-4">
            Biết ai đã làm gì.
            <br />
            <Green>Và điều gì đã thay đổi.</Green>
          </Heading>
        </div>
        <BrowserFrame>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-az-text">Lịch sử hoạt động hệ thống</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-white/[0.05] text-az-muted text-xs hover:bg-white/10 transition-colors">
                  Lọc module
                </button>
                <button className="px-3 py-1 rounded-lg bg-white/[0.05] text-az-muted text-xs hover:bg-white/10 transition-colors">
                  Xuất CSV
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  {['Thời gian', 'Người dùng', 'Module', 'Hành động', 'Kết quả'].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 text-az-muted font-medium text-[10px] uppercase tracking-wider">
                      {h}
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
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 text-az-muted text-[11px] font-mono">{row[0]}</td>
                    <td className="py-2.5 px-3 text-az-text text-[11px]">{row[1]}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-az-green/10 text-az-green text-[10px]">{row[2]}</span>
                    </td>
                    <td className="py-2.5 px-3 text-az-text text-[11px]">{row[3]}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${row[4] === 'Success' ? 'bg-az-green/15 text-az-green' : 'bg-yellow-500/15 text-yellow-400'}`}
                      >
                        {row[4]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    c: '#28D17C',
  },
  {
    n: '02',
    title: 'Phát hiện vấn đề sớm',
    desc: 'Nhận cảnh báo trước khi token hết hạn, tài khoản bị khóa hay ngân sách cạn kiệt.',
    c: '#3DE0D1',
  },
  {
    n: '03',
    title: 'Vận hành team rõ ràng',
    desc: 'Phân quyền theo vai trò, audit log đầy đủ — ai làm gì, khi nào, kết quả ra sao.',
    c: '#77F1B1',
  },
  {
    n: '04',
    title: 'Mở rộng dễ hơn',
    desc: 'Thêm nhân sự, thêm tài khoản, thêm khách hàng mà không mất kiểm soát.',
    c: '#28D17C',
  },
]

function Benefits() {
  return (
    <Section>
      <Container>
        <div className="text-center mb-14">
          <Eyebrow>Lợi ích</Eyebrow>
          <Heading className="mt-4">
            Ít thao tác thủ công hơn.
            <br />
            <Green>Nhiều quyền kiểm soát hơn.</Green>
          </Heading>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((b) => (
            <div key={b.n} className="relative">
              <div className="text-7xl font-black opacity-[0.06] leading-none mb-4" style={{ color: b.c }}>
                {b.n}
              </div>
              <div className="text-lg font-bold text-az-text mb-2">{b.title}</div>
              <p className="text-az-muted text-sm leading-relaxed">{b.desc}</p>
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
  return (
    <Section className="relative overflow-hidden" bg="#040907">
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
        <Eyebrow>Bắt đầu ngay hôm nay</Eyebrow>
        <h2 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-az-text">
          Đưa toàn bộ vận hành quảng cáo
          <br />
          <Green>về một nơi.</Green>
        </h2>
        <p className="mt-6 text-az-muted text-lg max-w-lg mx-auto leading-relaxed">
          Hơn 500 team đang dùng AezCheck để kiểm soát quảng cáo Meta hiệu quả hơn mỗi ngày.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Btn className="text-base px-8 py-3.5">Bắt đầu trải nghiệm</Btn>
          <Btn variant="outline" className="text-base px-8 py-3.5">
            Khám phá tính năng →
          </Btn>
        </div>
      </Container>
    </Section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="border-t border-white/[0.06] py-16 px-6"
      style={{ background: '#040907' }}
    >
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-az-green flex items-center justify-center text-az-security font-black text-xs">
                AZ
              </div>
              <span className="font-bold text-az-text">AezCheck</span>
            </div>
            <p className="text-az-muted text-sm leading-relaxed max-w-xs">
              Control Center cho toàn bộ hệ thống quảng cáo Meta / Facebook của bạn.
            </p>
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
              <div className="text-az-text font-semibold text-sm mb-3">{col.title}</div>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-az-muted text-sm hover:text-az-text transition-colors mb-2"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-az-muted text-xs">© 2026 AezCheck. All rights reserved.</span>
          <div className="flex gap-6">
            {['Terms', 'Privacy'].map((l) => (
              <a key={l} href="#" className="text-az-muted text-xs hover:text-az-text transition-colors">
                {l}
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
    <div style={{ background: '#07110F', color: '#F5F7F6', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <Hero />
      <Ecosystem />
      <PainPoints />
      <ControlCenter />
      <AssetManagement />
      <AdsManagement />
      <Shield />
      <Workspace />
      <Finance />
      <TeamPermission />
      <ActivityHistory />
      <Benefits />
      <FinalCTA />
      <Footer />
    </div>
  )
}
