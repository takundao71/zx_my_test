// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { getCtx } from './context.mjs'

export function quote(arg) {
  if (/^[a-z0-9/_.-]+$/i.test(arg) || arg === '') {
    return arg
  }
  return (
    `$'` +
    arg
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\f/g, '\\f')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\v/g, '\\v')
      .replace(/\0/g, '\\0') +
    `'`
  )
}

export function formatCmd(pieces, ...args) {
  let cmd = pieces[0],
    i = 0
  let quote = getCtx().quote
  while (i < args.length) {
    let s
    if (Array.isArray(args[i])) {
      s = args[i].map((x) => quote(substitute(x))).join(' ')
    } else {
      s = quote(substitute(args[i]))
    }
    cmd += s + pieces[++i]
  }

  return cmd
}

function substitute(arg) {
  if (arg?.stdout) {
    return arg.stdout.replace(/\n$/, '')
  }
  return `${arg}`
}
