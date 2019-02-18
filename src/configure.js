import path from 'path'

export default function configure() {
  const packageJson = require(path.join(process.cwd(), 'package.json'))

  const referenceLocaleFromPackageJson =
    packageJson['intl-equalizer'] &&
    packageJson['intl-equalizer'].referenceLocale

  const localesDirectoryFromPackageJson =
    packageJson['intl-equalizer'] &&
    packageJson['intl-equalizer'].localeDirectory

  const referenceLocale = referenceLocaleFromPackageJson || 'en'

  const localesDirectory =
    (localesDirectoryFromPackageJson &&
      path.join(process.cwd(), localesDirectoryFromPackageJson)) ||
    path.join(process.cwd(), 'messages')

  return {
    localesDirectory,
    referenceLocale,
  }
}
