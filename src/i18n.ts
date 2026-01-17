import { i18n } from '@lingui/core'

import { messages as enMessages } from './locales/en'
import { messages as viMessages } from './locales/vi'

export const locales = {
  vi: 'Tiếng Việt',
  en: 'English'
}

export type Locale = keyof typeof locales

const DEFAULT_LOCALE: Locale = 'vi'

const savedLocale = localStorage.getItem('locale') as Locale | null

i18n.load({
  en: enMessages,
  vi: viMessages
})

i18n.activate(savedLocale || DEFAULT_LOCALE)

export function changeLanguage(locale: Locale) {
  i18n.activate(locale)
  localStorage.setItem('locale', locale)
}

export default i18n
