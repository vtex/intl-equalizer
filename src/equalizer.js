import fs from 'fs'
import path from 'path'
import { ERRORS } from './constants'
import fileReader from './fileReader'

export default function equalize({
  languages,
  localesDirectory,
  referenceLocale,
}) {
  const termsPerLanguage = fileReader({ languages, localesDirectory })

  const hasEmptyLanguage = languages.some(
    language =>
      !termsPerLanguage[language] ||
      Object.keys(termsPerLanguage[language]).length === 0
  )

  if (hasEmptyLanguage) {
    return {
      data: languages.find(
        language =>
          !termsPerLanguage[language] ||
          Object.keys(termsPerLanguage[language]).length === 0
      ),
      error: ERRORS.ERROR_NO_KEYS_LOCALE,
    }
  }

  const processedLanguages = {}

  Object.keys(termsPerLanguage[referenceLocale]).forEach(key => {
    languages.forEach(language => {
      if (!processedLanguages[language]) {
        processedLanguages[language] = {
          missingKeys: [],
        }
      }

      if (!termsPerLanguage[language][key]) {
        processedLanguages[language].missingKeys.push({
          key,
          ...termsPerLanguage[referenceLocale][key],
        })
      }
    })
  })

  return processedLanguages
}
