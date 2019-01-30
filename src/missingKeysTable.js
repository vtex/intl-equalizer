import Table from 'cli-table2'
import colors from 'colors/safe'

export default function createTable(missingTerms, referenceLocale) {
  const table = new Table({
    chars: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
    head: [
      {
        colSpan: 3,
        hAlign: 'center',
        content: colors.yellow(
          `REFERENCE LOCALE: ${referenceLocale.toUpperCase()}`
        ),
      },
    ],
  })

  table.push([
    { hAlign: 'center', content: colors.yellow('LOCALE') },
    { hAlign: 'center', content: colors.yellow('PATH') },
    { hAlign: 'center', content: colors.yellow('MISSING KEYS') },
  ])

  Object.keys(missingTerms).forEach(countryName => {
    if (countryName === referenceLocale) return

    const country = countryName.toUpperCase()
    const filepath = missingTerms[countryName].filepath
    const missingKeys = missingTerms[countryName].missingKeys.reduce(
      (acc, curr) => acc + curr.key + '\n',
      ''
    )
    table.push([country, filepath, missingKeys])
  })

  console.log(table.toString())
}
