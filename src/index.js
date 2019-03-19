#!/usr/bin/env node
import commander from 'commander'

import start from './start'
import fix from './fix'

commander.option('-f, --fix')
         .option('-a, --all', 'Show all errors.')
         .parse(process.argv)

if (commander.fix) {
  fix()
}

if (commander.all) {
  start({all: true})
}

if (commander.args.length < 1) {
  start()
}
