import chalk from 'chalk'
import { SyntaxError } from 'intl-messageformat-parser'

interface MissingKeyError {
  key: string
}

interface WrongKeyOrderError {
  key: string
  wrongLine: number
  correctLine: number
}

interface EqualizeSyntaxError {
  key: string
  error: SyntaxError
  message: string
}

interface LanguageResult {
  missingKeys: MissingKeyError[]
  wrongOrderKeys: WrongKeyOrderError[]
  extraKeys: string[]
  syntaxErrors: EqualizeSyntaxError[]
}

interface EqualizeError {
  code: string
  data: string
}

type LanguageCode = Exclude<string, 'error'>

export type EqualizeResult = {
  [language in LanguageCode]: LanguageResult
} & {
  error?: EqualizeError
}

export const logSyntaxErrors = (
  languages: string[],
  equalizeResult: EqualizeResult
) => {
  let totalErrors = 0
  let totalLanguages = 0

  languages.forEach((language) => {
    const languageResult = equalizeResult[language]

    if (languageResult.syntaxErrors.length === 0) {
      return
    }

    totalLanguages++

    const { syntaxErrors } = languageResult

    totalErrors += syntaxErrors.length

    console.log(
      chalk`  {red ${syntaxErrors.length} syntax error(s) found for language {bold ${language}}}\n`
    )

    syntaxErrors.forEach(({ key, error, message }) => {
      const columnOffsetWhitespace = new Array(
        error.location.start.column
      ).join(' ')

      console.log(chalk`  Error in key {bold ${key}}:`)
      console.log(`\n      ${message}`)
      console.log(`      ${columnOffsetWhitespace}^`)
      console.log(`      ${columnOffsetWhitespace}${error.message}\n`)
    })
  })

  console.log(
    chalk`❌ {red {bold ${totalErrors} syntax error(s) found in ${totalLanguages} language(s).}}`
  )
}
