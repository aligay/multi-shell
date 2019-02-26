import Console from 'omg-console'
import { resolve } from 'path'
import { writeFileSync } from 'fs'

import MultiShell, { Task } from './index'
import pkg from '../package.json'
const console = new Console('multi-shell')

let options: Task = {
  baseDir: process.cwd(),
  tasks: []
}

const moduleRequire = (path) => {
  const module = require(path)
  return module.__esModule ? module.default : module
}

const help = () => {
  console.log('-h, --help         output usage information')
  console.log('-v, --version      show version')
  process.exit()
}
const initConfig = (configFileName) => {
  const optionsFile = resolve(configFileName || process.cwd(), 'tasks.conf.js')
  writeFileSync(optionsFile, `module.exports = {
  baseDir: '${process.cwd()}',
  tasks: []
}
`, 'utf-8')
  console.info(`${optionsFile} has created`)
}

const args = process.argv.slice(2)
let configFile
if (!args.length) {
  help()
}

for (let i = 0; i < args.length; i++) {
  if (args[i][0] === '-') {
    switch (args[i]) {
      case '-v':
      case '--version':
        console.log(pkg.version)
        break

      case '-c':
      case '--config':
        configFile = args[i + 1] || ''
        if (configFile) ++i
        break

      case '--init':
        const configFileName = args[i + 1] || ''
        if (configFileName) ++i
        initConfig(configFileName)
        break

      case '--baseDir':
        const baseDir = args[i + 1] || ''
        if (!baseDir) break
        ++i
        options.baseDir = baseDir
        break

      case '-h':
      case '--help':
        help()
        break
    }
  } else {
    (options.tasks as Array<string>).push(args[i])
  }
}

if (configFile) {
  try {
    options = moduleRequire(resolve(process.cwd(), configFile))
  } catch (e) {
    console.error(`can't find config at path \`${configFile}\``)
  }
}

new MultiShell(options).run()
