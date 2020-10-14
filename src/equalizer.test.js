import { equalize, equalizeRegionLocales } from './equalizer'
import { ERRORS } from './constants'

jest.mock('fs')

describe('Equalizer', () => {
  it('should return error if doesnt have keys in a file', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__fixtures__/emptyLocales/en.js`]: '',
      [`${process.cwd()}/src/__fixtures__/emptyLocales/pt.json`]: '',
    })
    const result = equalize({
      languages: ['en', 'pt'],
      localesDirectory: `${process.cwd()}/src/__fixtures__/emptyLocales`,
      referenceLocale: 'en',
    })

    expect(result.error.data).toEqual('en')
    expect(result.error.code).toEqual(ERRORS.ERROR_NO_KEYS_LOCALE)
  })

  it('should return one missing key', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__fixtures__/locales/pt.json`]: '',
      [`${process.cwd()}/src/__fixtures__/locales/en.js`]: '',
    })

    const result = equalize({
      languages: ['en', 'pt'],
      localesDirectory: `${process.cwd()}/src/__fixtures__/locales`,
      referenceLocale: 'pt',
    })

    expect(result.en.missingKeys).toHaveLength(1)
  })

  it('should return equal locales', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__fixtures__/equalLocales/pt.json`]: '',
      [`${process.cwd()}/src/__fixtures__/equalLocales/en.js`]: '',
    })

    const result = equalize({
      languages: ['en', 'pt'],
      localesDirectory: `${process.cwd()}/src/__fixtures__/equalLocales`,
      referenceLocale: 'pt',
    })

    expect(result.en.missingKeys).toHaveLength(0)
    expect(result.pt.missingKeys).toHaveLength(0)
  })

  it('should return if keys are out of order', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__fixtures__/outOfOrder/pt.json`]: '',
      [`${process.cwd()}/src/__fixtures__/outOfOrder/en.json`]: '',
    })

    const result = equalize({
      languages: ['en', 'pt'],
      localesDirectory: `${process.cwd()}/src/__fixtures__/outOfOrder`,
      referenceLocale: 'pt',
    })

    expect(result.en.wrongOrderKeys).toHaveLength(2)
    expect(result.en.wrongOrderKeys[0].key).toBe('anotherExample')
    expect(result.en.wrongOrderKeys[0].wrongLine).toBe(1)
    expect(result.en.wrongOrderKeys[0].correctLine).toBe(2)
  })

  it('should validate invalid keys for regionLocales', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__fixtures__/outOfOrder/pt-PT.json`]: '',
      [`${process.cwd()}/src/__fixtures__/outOfOrder/en-US.json`]: '',
      [`${process.cwd()}/src/__fixtures__/outOfOrder/en.json`]: '',
    })

    const result = equalizeRegionLocales({
      regionLocales: ['pt-PT', 'en-US'],
      referenceLocale: 'en',
      localesDirectory: `${process.cwd()}/src/__fixtures__/outOfOrder`,
    })

    expect(result['en-US'].extraKeys).toHaveLength(0)
    expect(result['pt-PT'].extraKeys).toHaveLength(1)
  })
})
