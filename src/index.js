#!/usr/bin/env node
import commander from 'commander'

import start from './start'
import fix from './fix'

commander
  .option('-f, --fix')
  .option('-a, --all', 'Show all errors.')
  .parse(process.argv)

const isValidOption = () => {
  const options = commander.opts() || {}

  return Object.values(options).some((value) => value)
}

if (commander.fix) {
  fix()
}

if (commander.all) {
  start({ all: true })
}

if (!isValidOption()) {
  start()
}
