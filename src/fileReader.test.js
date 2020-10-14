import fileReader from './fileReader'

jest.mock('fs')

describe('File Reader', () => {
  it('should return an object by languages and their messages', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__fixtures__/locales/en.js`]: '',
      [`${process.cwd()}/src/__fixtures__/locales/pt.json`]: '',
    })

    const result = fileReader({
      languages: ['en', 'pt'],
      localesDirectory: `${process.cwd()}/src/__fixtures__/locales`,
    })

    expect(result.pt).toBeDefined()
    expect(result.pt.example).toBe('text')
    expect(result.pt.anotherExample).toBe('text')
    expect(result.en).toBeDefined()
    expect(result.en.example).toBe('text')
  })

  it('should return an empty object if language file is not found', () => {
    require('fs').__setMockFiles({
      [`${process.cwd()}/src/__fixtures__/locales/en.js`]: '',
      [`${process.cwd()}/src/__fixtures__/locales/pt.json`]: '',
    })

    const result = fileReader({
      languages: ['en', 'pt', 'es'],
      localesDirectory: `${process.cwd()}/src/__fixtures__/locales`,
    })

    expect(result.pt).toBeDefined()
    expect(result.en).toBeDefined()
    expect(result.es).toBeDefined()
    expect(Object.keys(result.es)).toHaveLength(0)
  })
})
