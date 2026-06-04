# How to use this template

1. Create a repo using this template
2. Connect the repo to a Vercel project
3. Create a Neon Postgres database and connect to the Vercel project
4. Create an OAuth app in GitHub.
5. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables to the Vercel project.
6. Generate a `BETTER_AUTH_SECRET` from their website and add it to the project.
7. Set `BETTER_AUTH_URL` as `http://localhost:3000` for development environment and `https://yourdomainname.extension` for production and preview environmentS.
8. Pull environment variables from the Vercel CLI.
