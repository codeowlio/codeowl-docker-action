import { glob, read } from '../../utils'
import yaml from 'yaml'

type ViolationType = 'dependency' | 'privacy'

interface Violations {
  dependency: number
  privacy: number
}

interface Offense {
  violations: ViolationType[]
  files: string[]
}

type DeprecatedReferences = Record<string, Offense>
type ComponentOffenses =  Record<string, DeprecatedReferences>

const requirements = async () => {
  const files = await packwerk_files()

  return files.length > 0
}

const packwerk_files = () => glob('./**/deprecated_references.yml')

const metrics = async () => {
  let files: string[] = []

  try {
    files = await packwerk_files()
  } catch (error) {
    files = []
  }

  const packwerk_items = (): Record<string, Offense> => {
    return files
      .map ((file) => yaml.parse(read(file)))
      .reduce((memo: DeprecatedReferences, componentOffenses: ComponentOffenses) => {
        const item = Object.values(componentOffenses).reduce((total: DeprecatedReferences, file: DeprecatedReferences) => ({...total, ...file}))

        return {
          ...memo,
          ...item
        }
      }, {})
  }

  const items = packwerk_items()

  const packwerk_violations = (): Violations => {
    return Object.values(items)
      .reduce((total: Violations, offense: Offense) => {
        Object.values(offense.violations).forEach((violation: ViolationType) => {
          total[violation] += 1
        })

        return total
      }, {
        dependency: 0,
        privacy: 0
      })
  }

  const violations = packwerk_violations()

  return {
    packwerk_number_of_dependency_violations: violations.dependency,
    packwerk_number_of_privacy_violations: violations.privacy
  }
}

export default {
  requirements,
  metrics
}
