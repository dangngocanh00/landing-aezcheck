import { useLanguage } from '../i18n/LanguageContext'
import { footerSupportCopy } from '../i18n/footer-support'
import { termsCopy } from '../i18n/terms'
import { landingExperienceDestination, privacyDestination, termsDestination, localizedHref } from '../landing-navigation'
import { LegalPageLayout } from './LegalPageLayout'

export function TermsPage() {
  const { locale } = useLanguage()
  const copy = termsCopy[locale]
  const items = [{ id: 'introduction', title: copy.introTitle }, ...copy.sections.map((section, index) => ({ id: `terms-section-${index}`, title: `${index + 1}. ${section.title}` }))]
  return <LegalPageLayout pageId="terms" locale={locale} destination={localizedHref(termsDestination, locale)} tocLabel={copy.contents} items={items}>
    <section id="introduction" data-legal-section tabIndex={-1} aria-labelledby="terms-heading">
      <h1 id="terms-heading">{footerSupportCopy[locale]['Điều khoản dịch vụ']}</h1>
      <p>{copy.intro}</p>
    </section>
    {copy.sections.map((section, index) => <section id={`terms-section-${index}`} key={index} data-legal-section tabIndex={-1} aria-labelledby={`terms-title-${index}`}>
      <h2 id={`terms-title-${index}`}><span>{index + 1}.</span> {section.title}</h2>
      <p>{section.body}</p>
      {index === 4 && <p>{copy.limits}</p>}
      {index === 5 && <a className="legal-link" href={localizedHref(privacyDestination, locale)}>{copy.privacyLink} →</a>}
      {index === 10 && <a className="legal-link" href={localizedHref(landingExperienceDestination, locale)}>{copy.contactLink} →</a>}
    </section>)}
  </LegalPageLayout>
}
