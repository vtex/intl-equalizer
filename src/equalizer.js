import { diffArrays } from 'diff'
import { parse } from 'intl-messageformat-parser'

import { ERRORS } from './constants'
import fileReader from './fileReader'

function getExtraKeys(referenceKeys, currentLanguageKeys) {
  return currentLanguageKeys.filter(
    (key) => !referenceKeys.some((currKey) => currKey === key)
  )
}

function getCorrectLines(referenceOrder, languageOrder) {
  const diff = diffArrays(referenceOrder, languageOrder)

  const correctLines = diff.reduce((chunks, line) => {
    const [key] = line.value

    if (line.removed || line.added) {
      if (!chunks[key]) {
        chunks[key] = {}
      }
    }

    if (line.removed) {
      chunks[key] = {
        ...chunks[key],
        wrongLine: languageOrder.indexOf(key),
      }
    } else if (line.added) {
      chunks[key] = {
        ...chunks[key],
        correctLine: referenceOrder.indexOf(key),
      }
    }

    return chunks
  }, {})

  return Object.keys(correctLines).map((key) => {
    return {
      key,
      ...correctLines[key],
    }
  })
}

export function equalize({ languages, localesDirectory, referenceLocale }) {
  const termsPerLanguage = fileReader({ languages, localesDirectory })

  const hasEmptyLanguage = languages.some(
    (language) =>
      !termsPerLanguage[language] ||
      Object.keys(termsPerLanguage[language]).length === 0
  )

  if (hasEmptyLanguage) {
    return {
      error: {
        code: ERRORS.ERROR_NO_KEYS_LOCALE,
        data: languages.find(
          (language) =>
            !termsPerLanguage[language] ||
            Object.keys(termsPerLanguage[language]).length === 0
        ),
      },
    }
  }

  /** @type {import('./syntaxErrors').EqualizeResult} */
  const processedLanguages = {}

  const referenceOrder = Object.keys(termsPerLanguage[referenceLocale])

  Object.keys(termsPerLanguage[referenceLocale]).forEach((key) => {
    languages.forEach((language) => {
      if (!processedLanguages[language]) {
        processedLanguages[language] = {
          missingKeys: [],
          wrongOrderKeys: [],
          syntaxErrors: [],
          extraKeys: [],
        }
      }

      const languageTranslation = termsPerLanguage[language][key]

      if (!languageTranslation) {
        processedLanguages[language].missingKeys.push({
          key,
          ...termsPerLanguage[referenceLocale][key],
        })
      } else {
        try {
          // eslint-disable-next-line no-unused-vars
          const parsedMessage = parse(languageTranslation, {
            captureLocation: true,
          })

          // TODO: check if the AST of `parsedMessage` is roughly the same
          // as the reference locale
        } catch (err) {
          processedLanguages[language].syntaxErrors.push({
            key,
            error: err,
            message: languageTranslation,
          })
        }
      }

      const languageOrder = Object.keys(termsPerLanguage[language])

      processedLanguages[language].wrongOrderKeys = getCorrectLines(
        referenceOrder,
        languageOrder
      )

      processedLanguages[language].extraKeys = getExtraKeys(
        Object.keys(termsPerLanguage[referenceLocale]),
        Object.keys(termsPerLanguage[language])
      )
    })
  })

  return processedLanguages
}

export function equalizeRegionLocales({
  regionLocales,
  referenceLocale,
  localesDirectory,
}) {
  const languages = [...regionLocales, referenceLocale]
  const termsPerLanguage = fileReader({ languages, localesDirectory })

  const processedLanguages = {}

  regionLocales.forEach((region) => {
    processedLanguages[region] = {
      extraKeys: getExtraKeys(
        Object.keys(termsPerLanguage[referenceLocale]),
        Object.keys(termsPerLanguage[region])
      ),
    }
  })

  return processedLanguages
}
