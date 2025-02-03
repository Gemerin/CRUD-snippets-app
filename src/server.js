import express from 'express' // web app framework for node.js used to build web servers
import expressLayouts from 'express-ejs-layouts' // templating language to generate HTML with JS
import session from 'express-session' // middleware for express, manage user sessions through cookies
import logger from 'morgan' // HTTP request logger middleware for Node.js
import helmet from 'helmet'
import { connectToDatabase } from './config/mongoose.js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url' // function from url module, converts a file url to path
import { sessionOptions } from './config/sessionOptions.js'
import { router } from './routes/router.js'

try {
  /**
   * Route for handling logout process.
   */
  await connectToDatabase(process.env.DB_CONNECTION_STRING)

  /**
   * Create new express application.
   */
  const app = express()

  /**
   * Middleware to set Content Security Policy headers.
   *
   * @param {Function} helmet.contentSecurityPolicy - Helmet's CSP function.
   * @param {object} directives - The directives for the CSP header.
   * @param {object} directives.script-src - The sources allowed for scripts.
   */
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'"]
      }
    })
  )

  /**
   * Store directory path of current module(file) allowing node to construct paths to other files from current module instead of root.
   */
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  /**
   * Set the base URL to use for all relative URLs in a document.
   */
  const baseURL = process.env.BASE_URL || '/'

  /**
   * Set up a morgan logger using the development format for log entries.
   * This middleware will only be used if the application is not in production.
   */
  if (process.env.NODE_ENV !== 'production') {
    app.use(logger('dev'))
  }

  // View engine setup.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
  app.set('layout extractScripts', true)
  app.set('layout extractStyles', true)
  app.use(expressLayouts)

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  // When a form is submitted, the data is sent to the server as a URL-encoded string.
  // This middleware parses that data and makes it available on the req.body object in your route handlers.
  app.use(express.urlencoded({ extended: false }))

  // Serve static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Setup and use session middleware.
  //  allows the application to correctly identify the client's IP address and the protocol used for the request
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
  }
  app.use(session(sessionOptions))

  // Check for flash message stored in the session.If there is, makes message available to the views, and then deletes it from the session.
  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }
    // Pass the base URL to the views.
    res.locals.baseURL = baseURL

    next()
  })
  app.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
  })
  // Register routes.
  // every incoming request to your application will be passed through the router middleware.
  app.use('/', router)

  // Error handler.
  app.use((err, req, res, next) => {
    console.error(err)

    // 404 Not Found.
    if (err.status === 404) {
      res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
      return
    }

    // 403 error
    if (err.status === 403) {
      res
        .status(403)
        .sendFile(join(directoryFullName, 'views', 'errors', '403.html'))
      return
    }
    // 401 error
    if (err.status === 401) {
      res
        .status(401)
        .sendFile(join(directoryFullName, 'views', 'errors', '401.html'))
      return
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (process.env.NODE_ENV === 'production') {
      res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
    }
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${server.address().port}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
