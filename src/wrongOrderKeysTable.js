import Table from 'cli-table2'
import colors from 'colors/safe'
import { MESSAGES } from './constants'

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
        colSpan: 4,
        hAlign: 'center',
        content: colors.yellow(
          `KEYS WITH DIFFERENT ORDER \n Run 'intl-equalizer --fix' to fix the order of the keys.`
        ),
      },
    ],
  })

  table.push([
    {
      colSpan: 4,
      hAlign: 'center',
      content: colors.yellow(
        `REFERENCE LOCALE: ${referenceLocale.toUpperCase()}`
      ),
    },
  ])

  table.push([
    { hAlign: 'center', content: colors.yellow('LOCALE') },
    { hAlign: 'center', content: colors.yellow('KEY') },
    { hAlign: 'center', content: colors.yellow('CURRENT LINE') },
    { hAlign: 'center', content: colors.yellow('CORRECT LINE') },
  ])

  Object.keys(result).forEach(countryName => {
    if (countryName === referenceLocale) return

    const country = countryName.toUpperCase()

    result[countryName].wrongOrderKeys.forEach(currentKey => {
      table.push([
        country,
        currentKey.key,
        currentKey.wrongLine,
        currentKey.correctLine,
      ])
    })
  })

  console.log(table.toString())
}
