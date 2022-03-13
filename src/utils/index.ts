import * as fs from 'fs'
import { execSync } from 'child_process'
import { glob as globCall } from 'glob'

export const failShell = (command: string) => {
  // Almost all linters and checkes, they fail if they detect errors. We don't
  // want to fail hard when this happens.
  try {
    execSync(command)
  } catch (error) {
    // Ignore error
  }
}

export const unwrap = async <T>(thing: Promise<T> | T) => {
  if (thing instanceof Promise) {
    return await thing
  }

  return thing
}

export const shell = (command: string) => execSync(command).toString().slice(0, -1)
export const read = (filepath: string) => fs.readFileSync(filepath, 'utf8')
export const exists = (filepath: string) => fs.existsSync(filepath)
export const glob = (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    globCall(pattern, {}, function (err, files) {
      if (err) return reject(err)

      resolve(files)
    })
  })
}
