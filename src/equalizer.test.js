import equalize from './equalizer'
import { ERRORS } from './constants'

jest.mock('fs')

describe('Equalizer', () => {
  it('should return error if doesnt have keys in a file', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__mocks__/emptyLocales/emptyPT.json`]: '',
      [`${process.cwd()}/src/__mocks__/emptyLocales/emptyEN.js`]: '',
    })

    const result = equalize(
      ['en', 'pt'],
      `${process.cwd()}/src/__mocks__/emptyLocales`,
      'en'
    )

    expect(result.data).toEqual('en')
    expect(result.error).toEqual(ERRORS.ERROR_NO_KEYS_LOCALE)
  })

  it('should return missing keys', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__mocks__/locales/pt.json`]: '',
      [`${process.cwd()}/src/__mocks__/locales/en.js`]: '',
    })

    const result = equalize(
      ['en', 'pt'],
      `${process.cwd()}/src/__mocks__/locales`,
      'pt'
    )

    expect(result['en'].missingKeys.length).toBeGreaterThan(0)
  })

  it('should return equal locales', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__mocks__/equalLocales/pt.json`]: '',
      [`${process.cwd()}/src/__mocks__/equalLocales/en.js`]: '',
    })

    const result = equalize(
      ['en', 'pt'],
      `${process.cwd()}/src/__mocks__/equalLocales`,
      'pt'
    )

    expect(result['en'].missingKeys.length).toEqual(0)
    expect(result['pt'].missingKeys.length).toEqual(0)
  })
})
