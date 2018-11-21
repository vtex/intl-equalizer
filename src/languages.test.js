import { getAvailableLanguages } from './languages'
import { ERRORS } from './constants'

jest.mock('fs')

describe('languages', () => {
  it('should return error if doesnt have folder', () => {
    const result = getAvailableLanguages()

    expect(result.error).toEqual(ERRORS.ERROR_NO_LOCALE_FOLDER)
  })

  it('should return error if doesnt have files', () => {
    require('fs').__setMockFolder('/react/locales/')

    const result = getAvailableLanguages('/react/locales/')

    expect(result.error).toEqual(ERRORS.ERROR_NO_LOCALE_FILES)
  })

  it('should return languages if has files', () => {
    require('fs').__setMockFiles({
      '/react/locales/es.json': 'content',
      '/react/locales/en.js': 'content',
    })

    const expectedResult = ['es', 'en']

    const result = getAvailableLanguages('/react/locales')

    expect(result).toEqual(expectedResult)
  })

  it('should ignore langague files with region', () => {
    require('fs').__setMockFiles({
      '/react/locales/es.json': 'content',
      '/react/locales/en.js': 'content',
      '/react/locales/en-US.json': 'content',
    })

    const expectedResult = ['es', 'en']

    const result = getAvailableLanguages('/react/locales')

    expect(result).toEqual(expectedResult)
  })
})
