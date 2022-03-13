import * as fs from 'fs'
import * as path from 'path'
import { uniq, compact } from 'lodash'
import { shell } from '../../utils'

const requirements = () => {
  return fs.existsSync('.git')
}

const metrics = () => {
  const git_number_of_commits = () => {
    return shell("git log --format='%h'").split('\n').length
  }

  const git_number_of_branches = () => {
    return shell("git ls-remote -q").split('\n').filter((line) => !!line.match(/^refs\/heads/)).length
  }


  const git_number_of_tags = () => {
    return shell("git ls-remote -q").split('\n').filter((line) => !!line.match(/^refs\/tags/)).length
  }

  const git_number_of_contributors = () => {
    return uniq(shell("git log --format='%aN'").split('\n').sort()).length
  }

  const git_number_of_files = () => {
    return shell("git ls-tree -r HEAD --name-only").split('\n').length
  }

  const git_number_of_ignores_files = () => {
    return shell('git check-ignore *').split('\n').length
  }

  const git_number_of_lines = () => {
    return shell("git ls-files").split('\n').reduce((memo, filepath) => {
      return memo + fs.readFileSync(filepath, 'utf8').split('\n').length
    }, 0)
  }

  const git_file_extensions = () => {
    const extensions = shell("git ls-files").split('\n').map((filepath) => {
      return path.extname(filepath)
    }).reduce((memo: Record<string, number>, ext: string) => {
      const clean = ext.replace('.', '')

      if (!memo[clean]) memo[clean] = 0

      memo[clean] = memo[clean] + 1

      return memo
    }, {})

    const entries = compact(Object.entries(extensions).map((item) => {
      const [key, value] = item

      return [`git_file_extensions_${key}`, value]
    }))

    return Object.fromEntries(entries)
  }

  return {
    git_number_of_commits: git_number_of_commits(),
    git_number_of_branches: git_number_of_branches(),
    git_number_of_tags: git_number_of_tags(),
    git_number_of_contributors: git_number_of_contributors(),
    git_number_of_files: git_number_of_files(),
    git_number_of_ignores_files: git_number_of_ignores_files(),
    git_number_of_lines: git_number_of_lines(),

    ...git_file_extensions()
  }
}

export default {
  requirements,
  metrics
}
