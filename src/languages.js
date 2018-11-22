import fs from 'fs'
import { ERRORS } from './constants'

export function getAvailableLanguages(dir) {
  let languages = []

  try {
    languages = fs
      .readdirSync(dir)
      .filter(
        dir =>
          (dir.includes('.json') || dir.includes('.js')) && !dir.includes('-')
      )
      .map(dir => {
        if (dir.includes('.json')) return dir.replace('.json', '')
        if (dir.includes('.js')) return dir.replace('.js', '')
      })

    if (languages.length === 0) {
      return { error: ERRORS.ERROR_NO_LOCALE_FILES }
    }
  } catch (e) {
    return { error: ERRORS.ERROR_NO_LOCALE_FOLDER }
  }

  return languages
}
