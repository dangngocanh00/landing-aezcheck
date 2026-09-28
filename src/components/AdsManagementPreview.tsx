import { useId, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { adMockTabs, postsFooterCopy, type MockCell } from './ads-management-mock'
import './ads-management-preview.css'

export function AdsManagementPreview() {
  const { language } = useLanguage()
  const locale = language === 'vi' ? 0 : 1
  const [active, setActive] = useState(0)
  const id = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const tab = adMockTabs[active]
  const isPosts = active === 4
  const renderCell = (cell: MockCell) => typeof cell === 'string' ? cell :
    <span className={cell.tone ? `ads-preview-status ads-preview-status--${cell.tone}` : undefined}>{cell.label[locale]}</span>

  return <div className="ads-preview">
    <div className="ads-preview-tabs" role="tablist" aria-label={locale === 0 ? 'Quản lý quảng cáo mẫu' : 'Sample advertising management'}>
      {adMockTabs.map((item, index) => <button key={item.label[1]} type="button" role="tab"
        ref={element => { buttons.current[index] = element }}
        id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={active === index}
        tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)}
        onKeyDown={event => {
          const next = event.key === 'ArrowRight' ? (index + 1) % adMockTabs.length
            : event.key === 'ArrowLeft' ? (index + adMockTabs.length - 1) % adMockTabs.length
              : event.key === 'Home' ? 0 : event.key === 'End' ? adMockTabs.length - 1 : null
          if (next !== null) { event.preventDefault(); setActive(next); buttons.current[next]?.focus() }
        }}>{item.label[locale]}</button>)}
    </div>
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="ads-preview-panel">
      <div className="ads-preview-scroll">
        <table className={isPosts ? 'ads-preview-posts' : ''}>
          <thead><tr>{tab.columns.map(column => <th key={column[1]} scope="col">{column[locale]}</th>)}</tr></thead>
          <tbody>{tab.rows.length ? tab.rows.map(row => <tr key={row.id}>
            <td><span className="ads-preview-name" title={row.name}>{row.name}</span><small>{row.id}</small></td>
            {row.cells.map((cell, index) => <td key={index} title={typeof cell === 'string' ? cell : cell.label[locale]}>{renderCell(cell)}</td>)}
          </tr>) : <tr><td colSpan={tab.columns.length} className="ads-preview-empty">{locale === 0 ? 'Chưa có dữ liệu bài viết mẫu' : 'No sample post data yet'}</td></tr>}</tbody>
        </table>
      </div>
      <div className={`ads-preview-footer${isPosts ? ' ads-preview-footer--posts' : ''}`}>
        <span>{isPosts ? postsFooterCopy[locale] : locale === 0 ? (tab.rows.length ? 'Hiển thị 1–5 / 5 kết quả mẫu' : 'Hiển thị 0 / 0 kết quả') : (tab.rows.length ? 'Showing 1–5 / 5 sample results' : 'Showing 0 / 0 results')}</span>
        {isPosts ? <span className="ads-preview-pagination" aria-hidden="true"><span>‹</span><span className="ads-preview-page">1</span><span>2</span><span>3</span><span>…</span><span>7</span><span>›</span></span> : tab.rows.length > 0 && <span className="ads-preview-page" aria-hidden="true">1</span>}
      </div>
    </div>
  </div>
}
