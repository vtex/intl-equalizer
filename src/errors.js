import { ERRORS, MESSAGES } from './constants'

export default function throwError(error, data) {
  switch (error) {
    case ERRORS.ERROR_NO_LOCALE_FILES: {
      console.error(MESSAGES.NO_LOCALE_FILES(data))
      process.exit(1)
      break
    }

    case ERRORS.ERROR_NO_LOCALE_FOLDER: {
      console.error(MESSAGES.NO_LOCALE_FOLDER(process.cwd()))
      process.exit(1)
      break
    }

    case ERRORS.ERROR_NO_KEYS_LOCALE: {
      console.error(MESSAGES.ERROR_NO_KEYS_LOCALE(data))
      process.exit(1)
      break
    }

    default: {
      console.error('Unknown error')
      process.exit(1)
    }
  }
}
