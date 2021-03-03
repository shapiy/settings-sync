#!/usr/bin/env node

require('dotenv').config();

if (!process.env.GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN environment variable must be set.');
  console.error('Create a personal access token at https://github.com/settings/tokens/new');
  process.exit(1);
}
if (!process.env.GITHUB_ORG) {
  console.error('GITHUB_ORG environment variable must be set.');
  process.exit(1);
}

const {
  Octokit,
} = require('@octokit/rest');

const octokit = new Octokit({
  log: require('console-log-level')({
    level: 'info',
  }),
  auth: process.env.GITHUB_TOKEN,
});

const {
  Probot,
} = require('probot');
const app = require('probot-settings');

const probot = new Probot({
  githubToken: process.env.GITHUB_TOKEN,
});

probot.load(app);

const crypto = require('crypto');

const simulatePush = function (repo) {
  octokit.log.info(`Processing: ${repo.name} with default branch: ${repo.default_branch}`);
  return probot.webhooks.receive({
    id: crypto.randomBytes(20).toString('hex'),
    name: 'push',
    payload: {
      commits: [{
        added: [
          '.github/settings.yml',
        ],
        distinct: true,
        message: 'Add .github/settings.yml',
      }],
      ref: `refs/heads/${repo.default_branch}`,
      repository: repo,
    },
  });
};

async function listForOrgAll(owner) {
  return octokit.paginate(octokit.repos.listForOrg, {
    org: owner,
    per_page: 100,
    type: 'private',
  });
}

listForOrgAll(process.env.GITHUB_ORG)
  .then((data) => Promise.all(
    data.map(simulatePush),
  ));
