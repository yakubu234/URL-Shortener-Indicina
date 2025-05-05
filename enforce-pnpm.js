const userAgent = process.env.npm_config_user_agent;

if (!userAgent || !userAgent.includes('pnpm')) {
  console.warn(`
 This project requires pnpm.

You are trying to install dependencies with:
  ${userAgent}

Please use:
  pnpm install

Installation has been aborted.
`);

  process.exit(1);
}
