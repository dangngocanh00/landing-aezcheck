import { useLanguage } from '../i18n/LanguageContext'
import { privacyCopy, privacySlugs } from '../i18n/privacy'
import { landingExperienceDestination, privacyDestination, termsDestination, localizedHref } from '../landing-navigation'
import { LegalPageLayout } from './LegalPageLayout'

export function PrivacyPage() {
  const { locale } = useLanguage()
  const copy = privacyCopy[locale]
  const tocItems = [{ id: 'introduction', title: copy.introTitle }, ...privacySlugs.map((id, index) => ({ id, title: `${index + 1}. ${copy.sections[index][0]}` }))]
  return <LegalPageLayout pageId="privacy" locale={locale} destination={localizedHref(privacyDestination, locale)} tocLabel={copy.toc} items={tocItems}>
      <section id="introduction" data-legal-section tabIndex={-1} aria-labelledby="privacy-heading">
        <h1 id="privacy-heading">{copy.title}</h1>
        {copy.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>
      {privacySlugs.map((id, index) => {
        const [title, ...paragraphs] = copy.sections[index]
        return <section key={id} id={id} data-legal-section tabIndex={-1} aria-labelledby={`privacy-title-${id}`}>
          <h2 id={`privacy-title-${id}`}><span>{index + 1}.</span> {title}</h2>
          {paragraphs.map((paragraph, paragraphIndex) => index === 1 ? <div className="legal-data-group" key={paragraphIndex}>
            <h3>{paragraph.split(' — ')[0]}</h3><p>{paragraph.split(' — ')[1]}</p>
          </div> : <p key={paragraphIndex}>{paragraph}</p>)}
          {(index === 3 || index === 13) && <a className="legal-link" href={localizedHref(landingExperienceDestination, locale)}>{copy.contact} <span aria-hidden="true">→</span></a>}
          {index === 0 && <a className="legal-link" href={localizedHref(termsDestination, locale)}>{copy.terms} <span aria-hidden="true">→</span></a>}
        </section>
      })}
  </LegalPageLayout>
}
