import Table from 'cli-table3'
import chalk from 'chalk'

export default function createTable(result, referenceLocale) {
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
        content: chalk.yellow(`MISSING KEYS`),
      },
    ],
  })

  table.push([
    {
      colSpan: 3,
      hAlign: 'center',
      content: chalk.yellow(
        `REFERENCE LOCALE: ${referenceLocale.toUpperCase()}`
      ),
    },
  ])

  table.push([
    { hAlign: 'center', content: chalk.yellow('LOCALE') },
    { hAlign: 'center', content: chalk.yellow('PATH') },
    { hAlign: 'center', content: chalk.yellow('MISSING KEYS') },
  ])

  Object.keys(result).forEach((countryName) => {
    if (countryName === referenceLocale) return

    const country = countryName.toUpperCase()
    const { filepath } = result[countryName]
    const missingKeys = result[countryName].missingKeys.reduce(
      (acc, curr) => `${acc + curr.key}\n`,
      ''
    )

    table.push([country, filepath, missingKeys])
  })

  console.log(table.toString())
}
