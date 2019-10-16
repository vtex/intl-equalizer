import fs from 'fs'
import path from 'path'

function walk(dir, languages, callback) {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filepath = path.join(dir, file)
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

export default function fileReader({ languages, localesDirectory }) {
  const termsPerLanguage = languages.reduce((acc, lang) => {
    acc[lang] = {}
    return acc
  }, {})

  walk(localesDirectory, languages, filepath => {
    const language = path.basename(filepath, '.js').replace('.json', '')

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const terms = require(filepath)

    termsPerLanguage[language] = terms
  })

  return termsPerLanguage
}
