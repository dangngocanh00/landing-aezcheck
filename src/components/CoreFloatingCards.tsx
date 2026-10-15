import { localizeNode, translateText } from '../i18n/localize'
import { useLanguage } from '../i18n/LanguageContext'
import { coreFloatingCards } from '../i18n/core-floating-cards'
import { FeatureFloatingCard } from './FeatureFloatingCard'

const nodePaths = [
  'M9 10a3 3 0 1 0 6 0a3 3 0 1 0-6 0M5 21v-2a7 7 0 0 1 14 0v2',
  'M8 8a3 3 0 1 0 6 0a3 3 0 1 0-6 0M3 21v-3a7 7 0 0 1 14 0v3M17 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v2',
  'M3 10h5l12-6v16L8 14H3ZM8 14l2 7H6l-2-7',
  'M5 22V3m0 1c6-5 9 5 15 0v11c-6 5-9-5-15 0',
]

export function CoreAssetRelationCard() {
  const { language } = useLanguage()
  const copy = coreFloatingCards[language].assetRelation
  return <FeatureFloatingCard className="core-relation-card" title={translateText(copy.title)}>
    <h4>{localizeNode(copy.title)}</h4><p className="core-card-subtitle">{localizeNode(copy.subtitle)}</p>
    <div className="core-asset-flow">{localizeNode([copy.via, copy.bm, copy.adAccounts, copy.fanpages].map((label, i) => <div className="core-asset-step" key={i}>
      <div className="core-asset-node"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={nodePaths[i]} /></svg><span>{localizeNode(label)}</span></div>
      {localizeNode(i < 3 && <span className="core-connector" aria-hidden="true">{localizeNode("→")}</span>)}
    </div>))}</div>
    <div className="core-sync-status"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m7 12 3 3 7-7" /></svg><div><strong>{localizeNode(copy.synced)}</strong><p>{localizeNode(copy.syncedDescription)}</p></div></div>
  </FeatureFloatingCard>
}

export function CoreRecentChangeCard() {
  const { language } = useLanguage()
  const copy = coreFloatingCards[language].recentChange
  return <FeatureFloatingCard className="core-change-card" title={translateText(copy.title)}>
    <div className="core-change-heading"><svg className="core-bell" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10a7 7 0 0 1 14 0v5l2 3H3l2-3Zm4 11h6M12 1v2" /></svg><h4>{localizeNode(copy.title)}</h4></div>
    <strong className="core-account">{localizeNode(copy.account)}</strong>
    <div className="core-status-transition"><span className="core-old-status">{localizeNode(copy.oldStatus)}</span><span className="core-change-arrow" aria-hidden="true">{localizeNode("→")}</span><span className="core-new-status">{localizeNode(copy.newStatus)}</span></div>
    <p className="core-change-time"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 3" /></svg>{localizeNode(copy.time)}</p>
  </FeatureFloatingCard>
}
