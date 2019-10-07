import { getAvailableLanguages } from './languages'
import { ERRORS } from './constants'

jest.mock('fs')

describe('Languages', () => {
  it('should return error if doesnt have folder', () => {
    const result = getAvailableLanguages({})

    expect(result.error).toEqual(ERRORS.ERROR_NO_LOCALE_FOLDER)
  })

  it('should return error if doesnt have files', () => {
    require('fs').__setMockFolder('/react/locales/')

    const result = getAvailableLanguages({ directory: '/react/locales/' })

    expect(result.error).toEqual(ERRORS.ERROR_NO_LOCALE_FILES)
  })

  it('should return languages if has files', () => {
    require('fs').__setMockFiles({
      '/react/locales/es.json': 'content',
      '/react/locales/en.js': 'content',
    })

    const expectedResult = ['es', 'en']

    const result = getAvailableLanguages({ directory: '/react/locales' })

    expect(result.generalLocales).toEqual(expectedResult)
  })

  it('should split language files into general and with region', () => {
    require('fs').__setMockFiles({
      '/react/locales/es.json': 'content',
      '/react/locales/en.js': 'content',
      '/react/locales/en-US.json': 'content',
    })

    const expectedResultGeneral = ['es', 'en']
    const expectedResultRegion = ['en-US']

    const result = getAvailableLanguages({ directory: '/react/locales' })

    expect(expectedResultGeneral).toEqual(result.generalLocales)
    expect(expectedResultRegion).toEqual(result.regionLocales)
  })

  it('should ignore files listed on the filesToIgnore option', () => {
    require('fs').__setMockFiles({
      '/react/locales/es.json': 'content',
      '/react/locales/en.js': 'content',
      '/react/locales/en-US.json': 'content',
    })

    const expectedResultGeneral = ['es']
    const expectedResultRegion = ['en-US']

    const result = getAvailableLanguages({
      directory: '/react/locales',
      filesToIgnore: ['en.js'],
    })

    expect(expectedResultGeneral).toEqual(result.generalLocales)
    expect(expectedResultRegion).toEqual(result.regionLocales)
  })
})
