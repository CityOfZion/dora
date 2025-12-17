import { Route, Routes, RouteProps } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

/** Sentry will be active only in the production
 *  environment to capture errors and exceptions.
 */

function initSentry() {
  if (process.env.NODE_ENV === 'production') {
    const history = createBrowserHistory()
    Sentry.init({
      dsn: process.env.SENTRY_KEY,
      integrations: [
        // Sentry.reactRouterV6BrowserTracingIntegration({}), // TODO: fix
      ],
      tracesSampleRate: 1.0,
    })
  }
}

type RouteElementProps = Omit<RouteProps, 'component' | ' render'>

const SentryRoutes: React.FC<RouteElementProps> =
  process.env.NODE_ENV === 'production'
    ? Sentry.withSentryReactRouterV6Routing(Routes)
    : Routes

export { SentryRoutes, initSentry }
