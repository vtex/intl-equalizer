import equalize from './equalizer'
import { ERRORS, MESSAGES } from './constants'
import { getAvailableLanguages } from './languages'
import { createTable } from './table'
import { configure } from './configure'

const config = configure()

const languages = getAvailableLanguages(config.localesDirectory)

switch (languages.error) {
  case ERRORS.ERROR_NO_LOCALE_FILES: {
    console.error(MESSAGES.NO_LOCALE_FILES(config.localesDirectory))
    process.exit(1)
  }

  case ERRORS.ERROR_NO_LOCALE_FOLDER: {
    console.error(MESSAGES.NO_LOCALE_FOLDER(process.cwd()))
    process.exit(1)
  }
}

const result = equalize(
  languages,
  config.localesDirectory,
  config.referenceLocale
)

const hasMissingTerms = languages.some(
  language => result.missingTerms[language].length !== 0
)

if (hasMissingTerms) {
  createTable(result.missingTerms, config.referenceLocale)
  process.exit(1)
} else {
  console.log(MESSAGES.SUCCESS)
  process.exit(0)
}
