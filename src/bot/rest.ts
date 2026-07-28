import { config } from '@probot/octokit-plugin-config'
import { Octokit as Core } from 'octokit'
import { logger } from '../utils/logger'

type GraphQlConfigurableOctokit = {
  graphql: {
    defaults: (options: {
      url: string
    }) => GraphQlConfigurableOctokit['graphql']
  }
}

type GitHubGraphQlEndpointOptions = {
  [key: string]: unknown
  githubGraphQlUrl?: string
}

export const githubGraphQlEndpointPlugin = (
  octokit: unknown,
  options: GitHubGraphQlEndpointOptions,
) => {
  if (!options.githubGraphQlUrl) return {}

  const graphQlCapableOctokit = octokit as GraphQlConfigurableOctokit
  graphQlCapableOctokit.graphql = graphQlCapableOctokit.graphql.defaults({
    url: options.githubGraphQlUrl,
  })
  return {}
}

export const Octokit = Core.plugin(
  config,
  githubGraphQlEndpointPlugin,
).defaults({
  userAgent: `octokit-rest.js/repo-sync-bot`,
})

export type Octokit = InstanceType<typeof Octokit>

export type GitHubEndpointConfig = {
  apiUrl: string
  graphQlUrl: string
}

const personalOctokitLogger = logger.getSubLogger({ name: 'personal-octokit' })

export const personalOctokit = (
  token: string,
  endpointConfig: GitHubEndpointConfig,
) => {
  return new Octokit({
    auth: token,
    log: personalOctokitLogger,
    baseUrl: endpointConfig.apiUrl,
    githubGraphQlUrl: endpointConfig.graphQlUrl,
  })
}
