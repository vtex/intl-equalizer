#!/usr/bin/env node
import commander from 'commander'
import start from './start'
import fix from './fix'

commander.command('fix').action(fix)

commander.parse(process.argv)

if (commander.args.length < 1) {
  start()
}
