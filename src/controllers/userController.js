import { UserModel } from '../models/user.js'
const accountController = {}

/**
 * This asynchronous method handles the HTTP POST request to register a new user.
 * It retrieves the username and password from the request body and creates a new user.
 * If an error occurs during the process, it sets a flash message and redirects to the login page.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} - If an error occurs during the process, it is passed to the next middleware function.
 */
accountController.registerPost = async (req, res, next) => {
  const { username, password } = req.body
  const user = new UserModel({ username, password })

  try {
    await user.save()
    res.redirect('./login')
  } catch (error) {
    next(error)
  }
}

/**
 * This asynchronous method handles the HTTP POST request to log in a user.
 * It retrieves the username and password from the request body and authenticates the user.
 * If the user is authenticated successfully, it regenerates the session and stores the user in the session.
 * If an error occurs during the process, it sets a flash message and redirects to the login page.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} - If an error occurs during the process, it is passed to the next middleware function.
 */
accountController.loginPost = async (req, res, next) => {
  try {
    const user = await UserModel.authenticate(req.body.username, req.body.password)
    req.session.regenerate((err) => {
      if (err) {
        throw new Error('Failed to re-generate session.')
      }
      req.session.user = user // store authenticate user in the session
      res.redirect('..') // redirect to home
    })
  } catch (error) {
    req.session.flash = { type: 'danger', text: 'The snippet was created successfully.' }
    res.redirect('/login')
  }
}

/**
 * Handles user login.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
accountController.login = (req, res) => {
  res.render('user/login')
}

/**
 * Handles user registration.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
accountController.register = (req, res) => {
  res.render('user/register')
}

/**
 * Handles user logout.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {void} - The function does not return a value but ends the response cycle or passes an error to the next middleware.
 */
accountController.logout = (req, res, next) => {
  if (!req.session.user) {
    const err = new Error('Not logged in')
    err.status = 404
    return next(err)
  }
  req.session.destroy((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('..')
  })
}

export { accountController }
