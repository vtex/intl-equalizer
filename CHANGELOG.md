# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2019-02-18

### Added

- `commander` for optional parameters
- `build:watch` script for watching changes
- `intl-equalizer --fix` command to fix order based on the referenceLocale
- `extraKeysTable` result if another locale has more keys than the referenceLocale

### Changed

- `missingKeysTable` with new title
- `wrongOrderKeysTable` with new title
- `NO_LOCALE_FILES` error message

## [2.1.0] - 2019-02-15

### Added

- Create `wrongOrderKeys` table

### Changed

- `table` to `missingKeysTable`

## [2.0.1] - 2018-12-19

- Update npm package build script

## [2.0.0] - 2018-12-19

## Changed

- Change default `react/locales` folder for `messages`

## [1.0.1] - 2018-11-22

- Add env node to index

## [1.0.0] - 2018-11-22

- Add equalizer initial equalizer configuration
- Add error handling
- Add unit tests
