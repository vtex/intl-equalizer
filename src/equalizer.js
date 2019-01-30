import fs from 'fs'
import path from 'path'
import { ERRORS } from './constants'

export default function equalize({
  languages,
  localesDirectory,
  referenceLocale,
}) {
  const termsPerLanguage = {}

  walk(localesDirectory, languages, filepath => {
    const language = path.basename(filepath, '.js').replace('.json', '')

    const terms = require(filepath)

    Object.keys(terms).forEach(term => {
      if (!termsPerLanguage[language]) {
        termsPerLanguage[language] = {
          filepath,
        }
      }
      termsPerLanguage[language][term] = {
        referenceValue: terms[term],
      }
    })
  })

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

function walk(dir, languages, callback) {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    var filepath = path.join(dir, file)
    const stats = fs.statSync(filepath)
    if (stats.isDirectory()) {
      walk(filepath, callback)
    } else if (
      stats.isFile() &&
      (languages.includes(path.basename(filepath, '.js')) ||
        languages.includes(path.basename(filepath, '.json')))
    ) {
      callback(filepath, stats)
    }
  })
}
