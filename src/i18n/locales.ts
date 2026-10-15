export const supportedLocales = ['vi', 'en', 'ru', 'zh', 'th', 'lo'] as const
export type AppLocale = typeof supportedLocales[number]
export const localeNames: Record<AppLocale, string> = { vi: 'Tiếng Việt', en: 'English', ru: 'Русский', zh: '简体中文', th: 'ไทย', lo: 'ລາວ' }
export const localizedLocaleNames: Record<AppLocale, Record<AppLocale, string>> = {
  vi: { vi: 'Tiếng Việt', en: 'Tiếng Anh', ru: 'Tiếng Nga', zh: 'Tiếng Trung (giản thể)', th: 'Tiếng Thái', lo: 'Tiếng Lào' },
  en: { vi: 'Vietnamese', en: 'English', ru: 'Russian', zh: 'Chinese (Simplified)', th: 'Thai', lo: 'Lao' },
  ru: { vi: 'Вьетнамский', en: 'Английский', ru: 'Русский', zh: 'Китайский (упрощённый)', th: 'Тайский', lo: 'Лаосский' },
  zh: { vi: '越南语', en: '英语', ru: '俄语', zh: '简体中文', th: '泰语', lo: '老挝语' },
  th: { vi: 'ภาษาเวียดนาม', en: 'ภาษาอังกฤษ', ru: 'ภาษารัสเซีย', zh: 'ภาษาจีน (ตัวย่อ)', th: 'ภาษาไทย', lo: 'ภาษาลาว' },
  lo: { vi: 'ພາສາຫວຽດນາມ', en: 'ພາສາອັງກິດ', ru: 'ພາສາລັດເຊຍ', zh: 'ພາສາຈີນ (ຕົວຫຍໍ້)', th: 'ພາສາໄທ', lo: 'ພາສາລາວ' },
}
export const normalizeLocale = (value: string | null | undefined): AppLocale => supportedLocales.includes(value as AppLocale) ? value as AppLocale : 'en'
