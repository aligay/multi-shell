import { spawn, ChildProcess } from 'child_process'
import { normalize } from 'path'
import Console from 'omg-console'

const console = new Console('multi-shell')
export interface Task {
  baseDir?: string
  tasks?: string[]
}

class MultiShell {
  private baseDir: string = ''
  private sh: string
  private shFlag: string
  private options: Task
  private children: ChildProcess[] = []

  constructor (options: Task = {
    baseDir: '',
    tasks: []
  }) {
    this.options = options
    if (process.platform === 'win32') {
      this.sh = 'cmd'
      this.shFlag = '/c'
    } else {
      this.sh = 'sh'
      this.shFlag = '-c'
    }

    if (this.options.baseDir) {
      this.baseDir = normalize(this.options.baseDir.replace('~', process.env.HOME || ''))
    }
  }

  run () {
    if (!this.options.tasks) return

    this.options.tasks.forEach(cmd => {
      console.info(cmd)
      if (this.baseDir) {
        try {
          process.chdir(this.baseDir)
        } catch (e) {
          console.error(`no such file or directory: \`${this.baseDir}\``)
        }
      }

      const child = spawn(this.sh, [this.shFlag, cmd], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['pipe', process.stdout, process.stderr]
      })
      .on('error', (err) => {
        console.log(err)
      })
      process.on('SIGINT', () => {
        this.close()
      })

      this.children.push(child)
    })
  }

  private close () {
    for (const child of this.children) {
      if (!child.killed) {
        child.removeAllListeners('close')
        try {
          process.kill(child.pid, 'SIGINT')
          child.on('close', () => {
            process.exit(0)
          })
        } catch (e) {
          // console.log(e.message)
        }
      }
    }
  }
}

export default MultiShell
