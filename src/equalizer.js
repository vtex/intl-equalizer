import { ERRORS } from './constants'
import fileReader from './fileReader'
import { diffArrays } from 'diff'

export default function equalize({
  languages,
  localesDirectory,
  referenceLocale,
}) {
  const termsPerLanguage = fileReader({ languages, localesDirectory })

  const hasEmptyLanguage = languages.some(
    language =>
      !termsPerLanguage[language] ||
      Object.keys(termsPerLanguage[language]).length === 0
  )

  if (hasEmptyLanguage) {
    return {
      error: {
        code: ERRORS.ERROR_NO_KEYS_LOCALE,
        data: languages.find(
          language =>
            !termsPerLanguage[language] ||
            Object.keys(termsPerLanguage[language]).length === 0
        ),
      },
    }
  }

  const processedLanguages = {}

  Object.keys(termsPerLanguage[referenceLocale]).forEach(key => {
    const referenceOrder = Object.keys(termsPerLanguage[referenceLocale])

    languages.forEach(language => {
      if (!processedLanguages[language]) {
        processedLanguages[language] = {
          missingKeys: [],
          wrongOrderKeys: [],
        }
      }

      if (!termsPerLanguage[language][key]) {
        processedLanguages[language].missingKeys.push({
          key,
          ...termsPerLanguage[referenceLocale][key],
        })
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

function getExtraKeys(referenceKeys, currentLanguageKeys) {
  return currentLanguageKeys.filter(
    key => !referenceKeys.some(currKey => currKey === key)
  )
}

function getCorrectLines(referenceOrder, languageOrder) {
  const diff = diffArrays(referenceOrder, languageOrder)

  const correctLines = diff.reduce((chunks, line) => {
    const key = line.value[0]
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

  return Object.keys(correctLines).map(key => {
    return {
      key,
      ...correctLines[key],
    }
  })
}
