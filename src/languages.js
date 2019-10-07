import fs from 'fs'

import { ERRORS } from './constants'

export function getAvailableLanguages({ directory, filesToIgnore = [] }) {
  let languages = []

  try {
    languages = fs
      .readdirSync(directory)
      .filter(
        fileName =>
          (fileName.includes('.json') || fileName.includes('.js')) &&
          !filesToIgnore.includes(fileName)
      )
      .map(fileName => {
        if (fileName.includes('.json')) return fileName.replace('.json', '')
        if (fileName.includes('.js')) return fileName.replace('.js', '')
      })

    if (languages.length === 0) {
      return { error: ERRORS.ERROR_NO_LOCALE_FILES }
    }
  } catch (e) {
    return { error: ERRORS.ERROR_NO_LOCALE_FOLDER }
  }

  return languages.reduce(
    (splittedLocales, locale) => {
      if (locale.indexOf('-') > 0) {
        splittedLocales.regionLocales.push(locale)
      } else {
        splittedLocales.generalLocales.push(locale)
      }

      return splittedLocales
    },
    {
      generalLocales: [],
      regionLocales: [],
    }
  )
}
