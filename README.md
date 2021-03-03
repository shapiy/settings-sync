# Settings Sync

Manually trigger GitHub Settings bot on all repositories in organization. 

## Why?

At the moment, GitHub Settings bot is triggered when:

- A commit is pushed with `.github/settings.yml` file modified.
- Repository default branch is changed.
- A repository is created.

Sometimes you want to manually sync your GitHub repos with the `.github/settings.yml` files in your repositories. 
For example, you can use [settings inheritance](https://probot.github.io/docs/best-practices/#store-configuration-in-the-repository),
but Settings bot [does not currently update](https://github.com/probot/settings/issues/95) child repositories when the 
parent is updated.

If this is the case, this simple script should help.

## Running

1. Generate a [personal access token](https://github.com/settings/tokens/new) with full control of private repositories.
2. Create a `.env` file and specify GitHub token and GitHub organization name.
3. Install and run the package.

```bash
nvm use
npm install
npm run start
```

## Notes

Currently, limited to private repos only.
