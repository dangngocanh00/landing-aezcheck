import { localizeNode, translateText } from '../i18n/localize'
﻿import { useLanguage } from '../i18n/LanguageContext'
import { footerSupportCopy } from '../i18n/footer-support'
import { termsCopy } from '../i18n/terms'
import { landingContactDestination, privacyDestination, termsDestination, localizedHref } from '../landing-navigation'
import { LegalPageLayout } from './LegalPageLayout'

export function TermsPage() {
  const { locale } = useLanguage()
  const copy = termsCopy[locale]
  const items = [{ id: 'introduction', title: copy.introTitle }, ...copy.sections.map((section, index) => ({ id: `terms-section-${index}`, title: `${index + 1}. ${section.title}` }))]
  return <LegalPageLayout pageId="terms" locale={locale} destination={localizedHref(termsDestination, locale)} tocLabel={copy.contents} items={items}>
    <section id="introduction" data-legal-section tabIndex={-1} aria-labelledby="terms-heading">
      <h1 id="terms-heading">{localizeNode(footerSupportCopy[locale]['Điều khoản dịch vụ'])}</h1>
      <p>{localizeNode(copy.intro)}</p>
    </section>
    {localizeNode(copy.sections.map((section, index) => <section id={`terms-section-${index}`} key={index} data-legal-section tabIndex={-1} aria-labelledby={`terms-title-${index}`}>
      <h2 id={`terms-title-${index}`}><span>{localizeNode(index + 1)}{localizeNode(".")}</span> {localizeNode(section.title)}</h2>
      <p>{localizeNode(section.body)}</p>
      {localizeNode(index === 4 && <p>{localizeNode(copy.limits)}</p>)}
      {localizeNode(index === 5 && <a className="legal-link" href={localizedHref(privacyDestination, locale)}>{localizeNode(copy.privacyLink)}{localizeNode(" →")}</a>)}
      {localizeNode(index === 10 && <a className="legal-link" href={landingContactDestination} target="_blank" rel="noopener noreferrer">{localizeNode(copy.contactLink)}{localizeNode(" →")}</a>)}
    </section>))}
  </LegalPageLayout>
}
