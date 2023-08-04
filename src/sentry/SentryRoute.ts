import { Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import * as Sentry from '@sentry/react'

/** Sentry will be active only in the production
 *  environment to capture errors and exceptions.
 */

function initSentry() {
  if (process.env.NODE_ENV === 'production') {
    const history = createBrowserHistory()
    Sentry.init({
      dsn: process.env.SENTRY_KEY,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
        }),
      ],
      tracesSampleRate: 1.0,
    })
  }
}

const SentryRoute =
  process.env.NODE_ENV === 'production'
    ? Sentry.withSentryRouting(Route)
    : Route

export { SentryRoute, initSentry }
