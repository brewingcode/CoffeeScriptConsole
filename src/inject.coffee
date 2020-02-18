#!/usr/bin/env coffee

fs = require 'fs'

deps = [
  'jquery-3.4.1'
  'lodash-4.17.15'
  'moment-2.24.0'
  'moment-timezone-0.5.27'
  'sugar-2.0.4'
  'custom-helpers'
  'markdown-table'
  'jquery.tablesorter.min'
]

script = 'var csconsole_injections = [\n'

for dep in deps
  content = fs.readFileSync "#{dep}.js"
  script += "  /* #{dep} */ '" + Buffer.from(content).toString('base64') + "',\n"

script += '];'

fs.writeFileSync 'csconsole_injections.js', script
