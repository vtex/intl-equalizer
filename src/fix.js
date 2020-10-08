import { getAvailableLanguages } from './languages'
import configure from './configure'
import throwError from './errors'
import fileReader from './fileReader'
import fileWriter from './fileWriter'
import { MESSAGES } from './constants'

export default function fix() {
  const { filesToIgnore, localesDirectory, referenceLocale } = configure()

  const availableLanguages = getAvailableLanguages({
    directory: localesDirectory,
    filesToIgnore,
  })

  if (availableLanguages.error) {
    throwError(availableLanguages.error, localesDirectory)
  }

  const languages = availableLanguages.generalLocales

  const termsPerLanguage = fileReader({
    languages,
    localesDirectory,
  })

  const failedSortLanguages = []

  const sortedLanguages = languages.reduce((accLanguages, locale) => {
    const localeKeysLength = Object.keys(termsPerLanguage[locale]).length
    const referenceLocaleKeysLength = Object.keys(
      termsPerLanguage[referenceLocale]
    ).length

    if (localeKeysLength !== referenceLocaleKeysLength) {
      console.log(
        MESSAGES.ERROR_COULD_NOT_FIX({
          referenceLocale,
          locale,
          referenceLocaleLength: referenceLocaleKeysLength,
          localeLength: localeKeysLength,
        })
      )
      failedSortLanguages.push(locale)

      return {
        ...accLanguages,
        [locale]: termsPerLanguage[locale],
      }
    }

    const sortedLanguage = Object.keys(
      termsPerLanguage[referenceLocale]
    ).reduce(
      (acc, key) => ({
        ...acc,
        [key]: termsPerLanguage[locale][key],
      }),
      {}
    )

    return {
      ...accLanguages,
      [locale]: sortedLanguage,
    }
  }, {})

  fileWriter({
    sortedLanguages,
    failedSortLanguages,
    locales: languages,
    localesDirectory,
    referenceLocale,
  })

  console.log(MESSAGES.SUCCESS_FIX)
  process.exit(0)
}
