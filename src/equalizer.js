import fs from 'fs'
import path from 'path'

export default function equalize(languages, localesDirectory, referenceLocale) {
  const termsPerLanguage = {}

  walk(localesDirectory, languages, filepath => {
    const language = path.basename(filepath, '.js').replace('.json', '')

    let terms = null

    if (filepath.indexOf('.json') > -1) {
      terms = require(filepath)
    } else if (languageJs) {
      terms = require(filepath).default
    }

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

  const missingTerms = {}

  Object.keys(termsPerLanguage[referenceLocale]).forEach(key => {
    languages.forEach(language => {
      if (!missingTerms[language]) {
        missingTerms[language] = {
          missingKeys: [],
        }
      }

      if (!termsPerLanguage[language][key]) {
        missingTerms[language].filepath = termsPerLanguage[
          referenceLocale
        ].filepath
          .replace(`${referenceLocale}.js`, `${language}.js`)
          .replace(process.cwd(), '')

        missingTerms[language].missingKeys.push({
          key,
          ...termsPerLanguage[referenceLocale][key],
        })
      }
    })
  })

  return { missingTerms }
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
