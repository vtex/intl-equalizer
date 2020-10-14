import fs from 'fs'

import { MESSAGES } from './constants'

export default function writeFile({
  sortedLanguages,
  failedSortLanguages,
  locales,
  localesDirectory,
  referenceLocale,
}) {
  locales.forEach((locale) => {
    if (
      locale === referenceLocale ||
      failedSortLanguages.find((failedLocale) => failedLocale === locale)
    ) {
      return
    }

    const content = JSON.stringify(sortedLanguages[locale], null, 2)

    try {
      console.log(MESSAGES.WRITING_LOCALE(locale))
      fs.writeFileSync(`${localesDirectory}/${locale}.json`, content, 'utf8')
    } catch (err) {
      console.error(err)
      console.log(MESSAGES.COULD_NOT_WRITE_JSON(locale))
      process.exit(1)
    }
  })
}
