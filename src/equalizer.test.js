import equalize from './equalizer'
import { ERRORS } from './constants'

jest.mock('fs')

describe('Equalizer', () => {
  it('should return error if doesnt have keys in a file', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__mocks__/emptyLocales/en.js`]: '',
      [`${process.cwd()}/src/__mocks__/emptyLocales/pt.json`]: '',
    })
    const result = equalize({
      languages: ['en', 'pt'],
      localesDirectory: `${process.cwd()}/src/__mocks__/emptyLocales`,
      referenceLocale: 'en',
    })

    expect(result.data).toEqual('en')
    expect(result.error).toEqual(ERRORS.ERROR_NO_KEYS_LOCALE)
  })

  it('should return one missing key', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__mocks__/locales/pt.json`]: '',
      [`${process.cwd()}/src/__mocks__/locales/en.js`]: '',
    })

    const result = equalize({
      languages: ['en', 'pt'],
      localesDirectory: `${process.cwd()}/src/__mocks__/locales`,
      referenceLocale: 'pt',
    })

    expect(result['en'].missingKeys.length).toEqual(1)
  })

  it('should return equal locales', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__mocks__/equalLocales/pt.json`]: '',
      [`${process.cwd()}/src/__mocks__/equalLocales/en.js`]: '',
    })

    const result = equalize({
      languages: ['en', 'pt'],
      localesDirectory: `${process.cwd()}/src/__mocks__/equalLocales`,
      referenceLocale: 'pt',
    })

    expect(result['en'].missingKeys.length).toEqual(0)
    expect(result['pt'].missingKeys.length).toEqual(0)
  })
})
