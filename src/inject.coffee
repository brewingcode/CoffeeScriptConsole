#!/usr/bin/env coffee

fs = require 'fs'
crypto = require 'crypto'

sha = -> crypto.randomBytes(5).toString('hex')
log = -> 0 # console.log

deps = [
  'jquery-3.4.1'
  'lodash-4.17.15'
  'moment-2.24.0'
  'moment-timezone-0.5.27'
  'custom-helpers'
  'markdown-table'
]

newscript = ''
injecting = false

for line in fs.readFileSync('livescript-console.js').toString().split /\n/
  log line
  if line.match /\.forEach/
    log 'pulling out!'
    injecting = false

  if not injecting
    log 'passing thru'
    newscript += line + '\n'

  if line.match /\[ \/\/ INJECT/
    log 'injecting!'
    injecting = true
    for f in deps
      content = fs.readFileSync "#{f}.js"
      newscript += "        /* #{f} */ '" + Buffer.from(content).toString('base64') + "',\n"

newfile = "/tmp/#{sha()}"
fs.writeFileSync newfile, newscript
console.log "wrote #{newfile}"
