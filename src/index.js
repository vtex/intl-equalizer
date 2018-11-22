#!/usr/bin/env node
import equalize from './equalizer'
import { configure } from './configure'
import { throwError } from './errors'
import { getAvailableLanguages } from './languages'
import { createTable } from './table'
import { MESSAGES } from './constants'

const config = configure()

const languages = getAvailableLanguages(config.localesDirectory)

if (languages.error) {
  throwError(languages.error, config.localesDirectory)
}

const result = equalize({
  languages,
  localesDirectory: config.localesDirectory,
  referenceLocale: config.referenceLocale,
})

if (result.error) {
  throwError(result.error, result.data)
}

const hasMissingTerms = languages.some(
  language => result[language].missingKeys.length !== 0
)

if (hasMissingTerms) {
  createTable(result, config.referenceLocale)
  process.exit(1)
} else {
  console.log(MESSAGES.SUCCESS)
  process.exit(0)
}
