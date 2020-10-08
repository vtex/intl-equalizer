import colors from 'colors/safe'

export const ERRORS = {
  ERROR_NO_LOCALE_FILES: 'ERROR_NO_LOCALE_FILES',
  ERROR_NO_LOCALE_FOLDER: 'ERROR_NO_LOCALE_FOLDER',
  ERROR_NO_KEYS_LOCALE: 'ERROR_NO_KEYS_LOCALE',
}

export const MESSAGES = {
  COULD_NOT_WRITE_JSON: (locale) =>
    colors.red(`❌ Error: Could not write keys to ${locale}.json.`),
  NO_LOCALE_FILES: (pathName) =>
    colors.red(
      `❌ Error: There are no locale files in "${pathName}. \n Only base locales are considered. (i.e. LOCALE.json)`
    ),
  NO_LOCALE_FOLDER: (pathName) =>
    colors.red(`❌ Error: There are no locale files folder in "${pathName}.`),
  ERROR_NO_KEYS_LOCALE: (locale) =>
    colors.red(
      `❌ Error: Locale ${locale} is empty. Add some keys or delete it.`
    ),
  ERROR_COULD_NOT_FIX: ({
    referenceLocale,
    locale,
    referenceLocaleLength,
    localeLength,
  }) =>
    colors.red(
      `❌ Error: Couldn't fix locale ${locale.toUpperCase()} due to differences on locale size. \n ${referenceLocale.toUpperCase()} has ${referenceLocaleLength} keys. Although, ${locale.toUpperCase()} has ${localeLength} keys.`
    ),
  WRITING_LOCALE: (locale) =>
    colors.yellow(`✏️  Writing sorted keys to ${locale}.json`),
  SUCCESS: colors.yellow('✨ All keys are perfectly localized!'),
  SUCCESS_FIX: colors.yellow('✨ Finished fixing keys!'),
}
