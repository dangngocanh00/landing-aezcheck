export const supportedLocales = ['vi', 'en'] as const
export type AppLocale = typeof supportedLocales[number]
export const localeNames: Record<AppLocale, string> = { vi: 'Tiếng Việt', en: 'English' }
export const normalizeLocale = (value: string | null | undefined): AppLocale => value === 'vi' ? 'vi' : 'en'
