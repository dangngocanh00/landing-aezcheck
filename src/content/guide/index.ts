import vi from './vi.json'
import en from './en.json'

export type GuideRun = { text: string; style: string }
export type GuideBlock = {
  type: string; runs: GuideRun[]; id?: string; level?: number; number?: number
  file?: string; width?: number; height?: number; caption?: GuideRun[]
}
export type GuideModule = { id: string; title: string; blocks: GuideBlock[] }
export type GuideGroup = { id: string; title: string; modules: string[] }
export type GuideContent = { locale: string; title: string; intro: GuideBlock[]; groups: GuideGroup[]; modules: GuideModule[] }
const guides: Record<string, GuideContent> = { vi, en }
export const getGuideContent = (locale: string): GuideContent => guides[locale] ?? guides.en
export const guideText = (runs: GuideRun[]) => runs.map(run => run.text).join('')
