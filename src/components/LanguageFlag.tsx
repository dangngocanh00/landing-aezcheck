import type { AppLocale } from '../i18n/locales'

/** SVG flags render consistently on Windows, including systems without flag emoji. */
export function LanguageFlag({ locale }: { locale: AppLocale }) {
  const star = '0,-1 .225,-.309 .951,-.309 .363,.118 .588,.809 0,.382 -.588,.809 -.363,.118 -.951,-.309 -.225,-.309'
  return <svg width="24" height="16" viewBox="0 0 30 20" aria-hidden="true" focusable="false" style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', borderRadius: 2 }}>
    {locale === 'vi' && <><path fill="#da251d" d="M0 0h30v20H0z" /><polygon points={star} transform="translate(15 10) scale(6)" fill="#ffdf00" /></>}
    {locale === 'en' && <><path fill="#012169" d="M0 0h30v20H0z" /><path d="m0 0 30 20m0-20L0 20" stroke="#fff" strokeWidth="4" /><path d="m0 0 30 20m0-20L0 20" stroke="#c8102e" strokeWidth="1.5" /><path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="7" /><path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="4" /></>}
    {locale === 'ru' && <><path fill="#fff" d="M0 0h30v20H0z" /><path fill="#0039a6" d="M0 6.667h30v6.666H0z" /><path fill="#d52b1e" d="M0 13.333h30V20H0z" /></>}
    {locale === 'zh' && <><path fill="#de2910" d="M0 0h30v20H0z" /><g fill="#ffde00"><polygon points={star} transform="translate(5 5) scale(3)" />{[[10,2,23],[12,4,45],[12,7,70],[10,9,20]].map(([x,y,r],i) => <polygon key={i} points={star} transform={`translate(${x} ${y}) rotate(${r})`} />)}</g></>}
    {locale === 'th' && <><path fill="#a51931" d="M0 0h30v20H0z" /><path fill="#f4f5f8" d="M0 3.333h30v13.334H0z" /><path fill="#2d2a4a" d="M0 6.667h30v6.666H0z" /></>}
    {locale === 'lo' && <><path fill="#ce1126" d="M0 0h30v20H0z" /><path fill="#002868" d="M0 5h30v10H0z" /><circle cx="15" cy="10" r="4" fill="#fff" /></>}
  </svg>
}
