import * as path from 'path'
import * as glob from 'glob'
import * as yargs from 'yargs'
import * as colors from 'colors'
import MultiShell from './m-sh'
import * as jsonuri from 'jsonuri'
import * as updater from 'npm-updater'
import * as pkg from '../package.json'
const KEYWORDS = ['parallel', 'p', 'run']

// check version
updater({
  package: pkg,
  abort: false,
  interval: '1d',
  registry: 'https://registry.npm.taobao.org',
  updateMessage: colors.yellow(`\nplease run \`yarn global add ${pkg['name']}@latest\` to update\n`)
})

const parallel = (tasks: string[]) => {
  new MultiShell({
    baseDir: process.cwd(),
    tasks
  }).run()
}

/* tslint:disable no-unused-expression */
yargs
  .usage('$0 <cmd> [args]')
  .command(['parallel', 'p'], 'm-sh \'npm run dev\' \'npm run tsc\'', () => {
    parallel(yargs.argv._.slice(1))
  })
  .command('run', 'will find all {package.json}, add run same shell. e.g m-sh run \'yarn install\'', () => {
    const shell = yargs.argv._.slice(1).join(' ').trim()
    if (!shell) return

    yargs.alias('i', 'ignore')
    let ignore = (yargs.argv.ignore || '') as string | string[]
    if (typeof ignore === 'string') ignore = [ignore]
    ignore = ignore.filter(Boolean).map(p => process.cwd() + '/' + jsonuri.normalizePath(p.trim()) + '/package.json').concat(['**/node_modules/**'])
    const pkgs = glob.sync(path.resolve(process.cwd(), '{**/*/,}package.json'), { ignore }).reverse()

    console.log('======='.gray)
    console.log(pkgs.map(pkg => `run \`${shell}\` at ${path.relative(process.cwd(), path.dirname(pkg)) || '.'}`).join('\n').gray)
    console.log('======='.gray)
    const tasks = pkgs.map(pkg => `cd ${path.dirname(pkg)} && sh -c '${shell}'`)
    parallel(tasks)
  })
  .version()
  .alias('v', 'version')
  .help()
  .alias('h', 'help')
  .argv

const subCmd = process.argv[2]

if (subCmd && !KEYWORDS.includes(subCmd)) {
  const tasks = yargs.argv._
  parallel(tasks)
}

if (process.argv.length < 3) {
  console.log((yargs as any).getUsageInstance().help())
}
