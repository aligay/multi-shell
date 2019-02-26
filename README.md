# multi-shell

---
[![dependencies Status](https://david-dm.org/aligay/multi-shell/status.svg)](https://david-dm.org/aligay/multi-shell)
[![devDependencies Status](https://david-dm.org/aligay/multi-shell/dev-status.svg)](https://david-dm.org/aligay/multi-shell?type=dev)

A tool to run multiple shell in parallel.

## Install

```shell
npm install multi-shell
```

## Usage

### with javascript

```javascript
import MutilShell from 'multi-shell'

new MutilShell({
  baseDir: '~/workspace/',
  tasks: [
    'cd a/ && npm run dev',
    'cd b/ && npm run dev'
  ]
}).run()

```

## with global shell

```shell
sudo npm install -g multi-shell

m-sh "cd node_project/ && npm run dev" "cd your_path/ && node serve.js" --baseDir xxx

# generate a config file
m-sh --init
# use config file
m-sh -c ./tasks.conf.js # or json
```

## with npm scripts

```json
{
  "dev": "m-sh 'npm run watch:a' 'npm run watch:b'",
  "watch:a": "...",
  "watch:b": "..."
}
```
