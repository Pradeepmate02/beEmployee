// Import with `import * as Sentry from "@sentry/node"` if you are using ESM

import * as Sentry from "@sentry/node"
Sentry.init({
  dsn: "https://27139110689fab5c9cc513faf1540d16@o4510673813110784.ingest.us.sentry.io/4510673821433856",
  integrations: [Sentry.mongooseIntegration()],
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});