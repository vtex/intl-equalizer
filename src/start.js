import { equalize, equalizeRegionLocales } from './equalizer'
import configure from './configure'
import throwError from './errors'
import { getAvailableLanguages } from './languages'
import { MESSAGES } from './constants'
import createMissingKeysTable from './missingKeysTable'
import createWrongOrderKeysTable from './wrongOrderKeysTable'
import createExtraKeysTable from './extraKeysTable'
import { logSyntaxErrors } from './syntaxErrors'

function hasExtraKeys(languages, equalizedList) {
  return languages.some(
    (language) => equalizedList[language].extraKeys.length !== 0
  )
}

function start(options = {}) {
  const { referenceLocale, localesDirectory, filesToIgnore } = configure()

  const availableLanguages = getAvailableLanguages({
    directory: localesDirectory,
    filesToIgnore,
  })

  if ('error' in availableLanguages) {
    throwError(availableLanguages.error, localesDirectory)

    return
  }

  const languages = availableLanguages.generalLocales

  const result = equalize({
    languages,
    localesDirectory,
    referenceLocale,
  })

  if (result.error) {
    throwError(result.error.code, result.error.data)

    return
  }

  const hasSyntaxErrors = languages.some(
    (language) => result[language].syntaxErrors.length > 0
  )

  if (hasSyntaxErrors) {
    // @ts-ignore: FIXME
    logSyntaxErrors(languages, result)
    if (!options.all) process.exit(1)
  }

  if (hasExtraKeys(languages, result)) {
    createExtraKeysTable(result, referenceLocale)
    if (!options.all) process.exit(1)
  }

  const hasMissingTerms = languages.some(
    (language) => result[language].missingKeys.length !== 0
  )

  if (hasMissingTerms) {
    createMissingKeysTable(result, referenceLocale)
    if (!options.all) process.exit(1)
  }

  const hasWrongOrderKeys = languages.some(
    (language) => result[language].wrongOrderKeys.length !== 0
  )

  if (hasWrongOrderKeys) {
    createWrongOrderKeysTable(result, referenceLocale)
    if (!options.all) process.exit(1)
  }

  let hasExtraKeysRegion = false

  if (availableLanguages.regionLocales.length > 0) {
    const regionResult = equalizeRegionLocales({
      regionLocales: availableLanguages.regionLocales,
      localesDirectory,
      referenceLocale,
    })

    hasExtraKeysRegion = hasExtraKeys(
      availableLanguages.regionLocales,
      regionResult
    )

    if (hasExtraKeysRegion) {
      createExtraKeysTable(regionResult, referenceLocale)
      if (!options.all) process.exit(1)
    }
  }

  if (
    options.all &&
    (hasExtraKeys ||
      hasMissingTerms ||
      hasWrongOrderKeys ||
      hasExtraKeysRegion ||
      hasSyntaxErrors)
  ) {
    process.exit(1)
  }

  console.log(MESSAGES.SUCCESS)
  process.exit(0)
}

export default start
