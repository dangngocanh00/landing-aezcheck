import type { CSSProperties } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { analyticsPreviewCopy } from '../i18n/analytics-preview'
import './analytics-scene.css'

const statuses = [
  { key: 'active', value: 9382, color: '#78e4bd', icon: '✓' },
  { key: 'disabled', value: 25717, color: '#69afc1', icon: '−' },
  { key: 'unsettled', value: 750, color: '#af9cda', icon: '↔' },
  { key: 'pending', value: 0, color: '#d6bc83', icon: '◷' },
] as const
const trend = [
  { key: 'active', color: '#78e4bd', values: [8, 8, 8, 7, 7, 7, 7] },
  { key: 'disabled', color: '#69afc1', values: [0, 0, 0, 7, 7, 7, 7] },
  { key: 'unsettled', color: '#af9cda', values: [0, 0, 0, 0, 0, 0, 0] },
] as const
const dates = ['1-9', '5-9', '9-9', '13-9', '17-9', '21-9', '27-9']
const statusTotal = statuses.reduce((sum, status) => sum + status.value, 0)
const number = (value: number) => value.toLocaleString('en-US')

function Shield() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 3v6c0 5-5 8-8 10-3-2-8-5-8-10V6Z" /><path d="m8 12 3 3 5-6" /></svg>
}

export function AnalyticsScene() {
  const { language } = useLanguage()
  const copy = analyticsPreviewCopy[language]
  return <div className="analytics-illustration">
    <div className="analytics-main">
      <header className="analytics-header"><div><h3>{copy.title}</h3><p>{copy.subtitle}</p></div><span>{copy.sample}</span></header>
      <div className="analytics-summary">
        <article className="analytics-surface"><span>{copy.connected}</span><div className="analytics-summary-value"><strong>56</strong><small className="analytics-pill">{copy.operating}</small></div></article>
        <article className="analytics-surface"><span>{copy.accounts}</span><div className="analytics-summary-value"><strong>44,604</strong><div className="analytics-substats"><span>{copy.business}: <b>0</b></span><span>{copy.personal}: <b>0</b></span></div></div></article>
      </div>
      <div className="analytics-status-grid">{statuses.map(status => <article className="analytics-surface" key={status.key} style={{ '--status-color': status.color } as CSSProperties}><span className="analytics-status-label"><i aria-hidden="true">{status.icon}</i>{copy.statuses[status.key]}</span><strong>{number(status.value)}</strong></article>)}</div>
      <div className="analytics-charts">
        <section className="analytics-chart"><h4>{copy.trendTitle}</h4>
          <div className="analytics-legend">{trend.map(series => <span key={series.key}><i style={{ background: series.color }} />{copy.statuses[series.key]}</span>)}</div>
          <svg className="analytics-line" viewBox="0 0 340 190" role="img" aria-label={copy.trendDescription}>
            {[0, 4, 8].map(value => <g key={value}><line x1="25" x2="325" y1={150-value*15} y2={150-value*15} stroke="#9fe7d015" /><text x="8" y={154-value*15}>{value}</text></g>)}
            {trend.map(series => <g key={series.key}><polyline points={series.values.map((value, i) => `${25+i*50},${150-value*15}`).join(' ')} fill="none" stroke={series.color} strokeWidth="2" strokeLinejoin="round" strokeDasharray={series.key === 'disabled' ? '4 3' : undefined} />{series.values.map((value, i) => <circle key={i} cx={25+i*50} cy={150-value*15} r="2.5" fill={series.color} />)}</g>)}
            {dates.map((date, i) => <text key={date} x={25+i*50} y="178" textAnchor="middle">{date}</text>)}
          </svg>
        </section>
        <section className="analytics-chart"><h4>{copy.structureTitle}</h4><div className="analytics-donut-content">
          <svg className="analytics-donut" viewBox="0 0 160 160" role="img" aria-label={copy.structureDescription}>
            <circle cx="80" cy="80" r="57" fill="none" stroke="#a1e7d00b" strokeWidth="15" />
            {statuses.map((status, i) => <circle key={status.key} cx="80" cy="80" r="57" fill="none" stroke={status.color} strokeWidth="15" pathLength="100" strokeDasharray={`${status.value/statusTotal*100} ${100-status.value/statusTotal*100}`} strokeDashoffset={-statuses.slice(0,i).reduce((sum,s)=>sum+s.value,0)/statusTotal*100} transform="rotate(-90 80 80)" />)}
            <text x="80" y="77" textAnchor="middle" className="analytics-donut-count">{number(statusTotal)}</text><text x="80" y="96" textAnchor="middle">{copy.classified}</text>
          </svg>
          <div className="analytics-legend analytics-legend--vertical">{statuses.map(status => <span key={status.key}><i style={{ background: status.color }} />{copy.statuses[status.key]}<b>{number(status.value)}</b></span>)}</div>
        </div></section>
      </div>
      <section className="analytics-risk"><div className="analytics-risk-heading"><Shield /><h4>{copy.riskTitle}</h4><span className="analytics-pill">{copy.noWarnings}</span></div><div className="analytics-risk-stats"><span>{copy.lostAccess}: <b>0</b></span><span>{copy.hiddenAdmins}: <b>0</b></span></div></section>
    </div>
    <div className="analytics-floating">
      <article className="analytics-float analytics-float--trend"><span>{copy.floatingTrendTitle}</span><strong>{copy.stable}</strong><svg className="analytics-sparkline" viewBox="0 0 160 24" fill="none" aria-hidden="true"><path d="m2 19 26-5 26 2 26-7 26 2 26-6 26-2" /><circle cx="158" cy="3" r="2" /></svg><small>{copy.floatingTrendCaption}</small></article>
      <article className="analytics-float analytics-float--risk"><span>{copy.riskTitle}</span><div className="analytics-float-shield"><Shield /></div><strong>{copy.zeroWarnings}</strong><small>{copy.floatingRiskCaption}</small></article>
    </div>
  </div>
}
