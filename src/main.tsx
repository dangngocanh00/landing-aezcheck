import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './theme/ThemeContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { loadCatalog } from './i18n/localize'
import { getSiteRoute } from './landing-navigation'
import { normalizeLocale } from './i18n/locales'

let savedLanguage: string | null = null
try { savedLanguage = localStorage.getItem('aezcheck-language') } catch { /* Storage is optional. */ }
const initialLocale = normalizeLocale(getSiteRoute(window.location.hash, window.location.pathname).locale ?? savedLanguage ?? document.documentElement.lang)
void loadCatalog(initialLocale).then(() => ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider><LanguageProvider><App /></LanguageProvider></ThemeProvider>
  </React.StrictMode>,
))
