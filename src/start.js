import equalize from './equalizer'
import configure from './configure'
import throwError from './errors'
import { getAvailableLanguages } from './languages'
import { MESSAGES } from './constants'
import createMissingKeysTable from './missingKeysTable'
import createWrongOrderKeysTable from './wrongOrderKeysTable'
import createExtraKeysTable from './extraKeysTable'

function start() {
  const config = configure()

  const languages = getAvailableLanguages(config.localesDirectory)

  if (languages.error) {
    throwError(languages.error, config.localesDirectory)
  }

  const result = equalize({
    languages,
    localesDirectory: config.localesDirectory,
    referenceLocale: config.referenceLocale,
  })

  if (result.error) {
    throwError(result.error.code, result.error.data)
  }

  const hasExtraKeys = languages.some(
    language => result[language].extraKeys.length !== 0
  )

  if (hasExtraKeys) {
    createExtraKeysTable(result, config.referenceLocale)
    process.exit(1)
  }

  const hasMissingTerms = languages.some(
    language => result[language].missingKeys.length !== 0
  )

  if (hasMissingTerms) {
    createMissingKeysTable(result, config.referenceLocale)
    process.exit(1)
  }

  const hasWrongOrderKeys = languages.some(
    language => result[language].wrongOrderKeys.length !== 0
  )

  if (hasWrongOrderKeys) {
    createWrongOrderKeysTable(result, config.referenceLocale)
    process.exit(1)
  }

  console.log(MESSAGES.SUCCESS)
  process.exit(0)
}

export default start
