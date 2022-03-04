import { read, exists, failShell } from '../../utils'

const execute = () => {
  failShell("npm install && npx eslint . -f json -o eslint.output.json")
}

const requirements = () => {
  return exists('eslint.output.json')
}

const metrics = () => {
  const eslint_files = JSON.parse(read('eslint.output.json'))
  const eslint_offenses = eslint_files.map((offense: any) => offense['messages']).flat()

  const eslint_number_of_offended_files = () => {
    return eslint_files.length
  }


  const eslint_number_of_offenses = () => {
    return eslint_offenses.length
  }

  const eslint_number_of_correctable = () => {
    return eslint_offenses.filter((offense: any) => offense['correctable']).length
  }

  const eslint_by_severity = () => {
    return eslint_offenses.reduce((memo: Record<string, number>, offense: any) => {
      const key = `eslint_severity_${severity(offense['severity'])}`

      if (!memo[key]) memo[key] = 0

      memo[key] += 1

      return memo
    }, {})
  }

  const eslint_by_rule = () => {
    return eslint_offenses.reduce((memo: Record<string, number>, offense: any) => {
      const ruleId = offense['ruleId']

      if (!ruleId) return memo

      const key = `eslint_rule_${clean(ruleId)}`

      if (!memo[key]) memo[key] = 0

      memo[key] += 1

      return memo
    }, {})
  }

  const clean = (key: string) => key.replace(/[-,.\/ ]/g, '_').toLowerCase()

  const severity = (value: number) => {
    if (value == 1) return 'warning'
    if (value == 2) return 'error'

    return 'unknown'
  }

  return {
    eslint_number_of_offended_files: eslint_number_of_offended_files(),
    eslint_number_of_offenses: eslint_number_of_offenses(),
    eslint_number_of_correctable: eslint_number_of_correctable(),

    ...eslint_by_severity(),
    ...eslint_by_rule()
  }
}

export default {
  execute,
  requirements,
  metrics
}
