import colors from 'colors/safe'

export const ERRORS = {
  ERROR_NO_LOCALE_FILES: 'ERROR_NO_LOCALE_FILES',
  ERROR_NO_LOCALE_FOLDER: 'ERROR_NO_LOCALE_FOLDER',
}

export const MESSAGES = {
  NO_LOCALE_FILES: pathName =>
    colors.red(`❌ Error: There are no locale files in "${pathName}"`),
  NO_LOCALE_FOLDER: pathName =>
    colors.red(`❌ Error: There is no locales folder in "${pathName}"`),
  SUCCESS: colors.yellow('✨ All keys are localized!'),
}
