#!/usr/bin/env coffee

fs = require 'fs'

deps = [
  'jquery-3.4.1'
  'lodash-4.17.15'
  'moment-2.24.0'
  'moment-timezone-0.5.27'
  'custom-helpers'
  'markdown-table'
]

file = 'livescript-console.js'
newscript = ''
injecting = false

for line in fs.readFileSync(file).toString().split /\n/
  if line.match /\.forEach/
    injecting = false

  if not injecting
    newscript += line + '\n'

  if line.match /\[ \/\/ INJECT/
    injecting = true
    for f in deps
      content = fs.readFileSync "#{f}.js"
      newscript += "        /* #{f} */ '" + Buffer.from(content).toString('base64') + "',\n"

fs.writeFileSync file, newscript
