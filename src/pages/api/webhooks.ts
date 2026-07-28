import app from 'bot'
import { githubGraphQlEndpointPlugin } from 'bot/rest'
import { createNodeMiddleware, createProbot, ProbotOctokit } from 'probot'
import { getGitHubApiUrl } from 'utils/github-urls'

const GheProbotOctokit = ProbotOctokit.plugin(
  githubGraphQlEndpointPlugin,
).defaults({
  baseUrl: getGitHubApiUrl(),
})

export const config = {
  api: {
    bodyParser: false,
  },
}

// Probot v14 requires a pino logger so custom logging has been removed
// In the future it is worth considering replacing tslog with pino entirely
export default await createNodeMiddleware(app, {
  probot: createProbot({
    defaults: {
      Octokit: GheProbotOctokit,
    },
  }),
  webhooksPath: '/api/webhooks',
})
