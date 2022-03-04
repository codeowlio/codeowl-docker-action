import eslint from './engines/eslint'
import git from './engines/git'
import npm from './engines/npm'
import packwerk from './engines/packwerk'
import { unwrap } from './utils'

type Metrics = Record<string, number>

interface Extractor {
  execute?: () => void
  requirements: () => boolean | Promise<boolean>
  metrics: () => Metrics | Promise<Metrics>
}

const extractors: Record<string, Extractor> = {
  eslint,
  git,
  npm,
  packwerk
}

const promises = Object.entries(extractors).map(async (entry) => {
  const [_name, extractor] = entry

  const requirements = await unwrap<boolean>(extractor.requirements())

  if (!requirements) {
    // If requirements are not met and we have an execute function, we run it
    if (extractor.execute) {
      extractor.execute()
    } else {
      return {}
    }
  }

  return await unwrap<Metrics>(extractor.metrics())
})

const compute = async () => {
  const results = await Promise.all(promises)

  return results.reduce((memo: Metrics, data: Metrics) => {
    return {
      ...memo,
      ...data
    }
  }, {})
}

compute().then(data => console.log(data));
