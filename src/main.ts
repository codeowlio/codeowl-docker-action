import { gql, GraphQLClient } from 'graphql-request'
import { sample } from 'lodash'

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

const main = async () => {
  const token = process.env.CODEOWL_API_KEY

  if (!token) throw "Unable to find a valid api token. Set your CODEOWL_API_KEY";

  const data = await compute()

  console.log("Pushing data to codeowl.io...")

  const ticks = Object.entries(data).map((item) => {
    const [metric, value] = item

    return {
      metric,
      value: value + 0.1 // FIXME: Backend must be able to handle integers
    }
  })

  const variables = {
    ticks
  }

  const query = gql`
    mutation CreateTicks($ticks: [TickInput!]!) {
      createTicks(ticks: $ticks) {
        metric
        value
      }
    }
  `

  const endpoint = 'https://api.codeowl.io/api/graphql'

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  // FIXME: Handle authentication errors
  const response = await graphQLClient.request(query, variables)

  console.log(JSON.stringify(response, undefined, 2))
}

main().catch((error) => console.error(error))
