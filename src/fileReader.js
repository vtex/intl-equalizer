import fs from 'fs'
import path from 'path'
import map from 'lodash/map'

export default function fileReader({ languages, localesDirectory }) {
  const termsPerLanguage = languages.reduce((acc, lang) => {
    acc[lang] = {}
    return acc
  }, {})

  walk(localesDirectory, languages, filepath => {
    const language = path.basename(filepath, '.js').replace('.json', '')

    const terms = require(filepath)

    termsPerLanguage[language] = terms
  })

  return termsPerLanguage
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
