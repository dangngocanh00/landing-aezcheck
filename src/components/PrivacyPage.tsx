import { localizeNode, translateText } from '../i18n/localize'
import { useLanguage } from '../i18n/LanguageContext'
import { privacyCopy, privacySlugs } from '../i18n/privacy'
import { landingContactDestination, privacyDestination, termsDestination, localizedHref } from '../landing-navigation'
import { LegalPageLayout } from './LegalPageLayout'

export function PrivacyPage() {
  const { locale } = useLanguage()
  const copy = privacyCopy[locale]
  const tocItems = [{ id: 'introduction', title: copy.introTitle }, ...privacySlugs.map((id, index) => ({ id, title: `${index + 1}. ${copy.sections[index][0]}` }))]
  return <LegalPageLayout pageId="privacy" locale={locale} destination={localizedHref(privacyDestination, locale)} tocLabel={copy.toc} items={tocItems}>
      <section id="introduction" data-legal-section tabIndex={-1} aria-labelledby="privacy-heading">
        <h1 id="privacy-heading">{localizeNode(copy.title)}</h1>
        {localizeNode(copy.intro.map(paragraph => <p key={paragraph}>{localizeNode(paragraph)}</p>))}
      </section>
      {localizeNode(privacySlugs.map((id, index) => {
        const [title, ...paragraphs] = copy.sections[index]
        return <section key={id} id={id} data-legal-section tabIndex={-1} aria-labelledby={`privacy-title-${id}`}>
          <h2 id={`privacy-title-${id}`}><span>{localizeNode(index + 1)}{localizeNode(".")}</span> {localizeNode(title)}</h2>
          {localizeNode(paragraphs.map((paragraph, paragraphIndex) => index === 1 ? <div className="legal-data-group" key={paragraphIndex}>
            <h3>{localizeNode(paragraph.split(' — ')[0])}</h3><p>{localizeNode(paragraph.split(' — ')[1])}</p>
          </div> : <p key={paragraphIndex}>{localizeNode(paragraph)}</p>))}
          {localizeNode((index === 3 || index === 13) && <a className="legal-link" href={landingContactDestination} target="_blank" rel="noopener noreferrer">{localizeNode(copy.contact)} <span aria-hidden="true">{localizeNode("→")}</span></a>)}
          {localizeNode(index === 0 && <a className="legal-link" href={localizedHref(termsDestination, locale)}>{localizeNode(copy.terms)} <span aria-hidden="true">{localizeNode("→")}</span></a>)}
        </section>
      }))}
  </LegalPageLayout>
}
