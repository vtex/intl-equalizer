import Table from 'cli-table2'
import colors from 'colors/safe'

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
        colSpan: 2,
        hAlign: 'center',
        content: colors.yellow(
          `EXTRA KEYS \n These keys are missing from the reference locale.`
        ),
      },
    ],
  })

  table.push([
    {
      colSpan: 2,
      hAlign: 'center',
      content: colors.yellow(
        `REFERENCE LOCALE: ${referenceLocale.toUpperCase()}`
      ),
    },
  ])

  table.push([
    { hAlign: 'center', content: colors.yellow('LOCALE') },
    { hAlign: 'center', content: colors.yellow('EXTRA KEYS') },
  ])

  Object.keys(result).forEach(countryName => {
    if (countryName === referenceLocale) return

    const country = countryName.toUpperCase()

    result[countryName].extraKeys.forEach(currentKey => {
      table.push([country, currentKey])
    })
  })

  console.log(table.toString())
}
