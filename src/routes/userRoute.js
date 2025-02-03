import { accountController } from '../controllers/userController.js'
import express from 'express'

/**
 * Router for user-related routes.
 */
export const router = express.Router()

/**
 * Route for displaying login form.
 */
router.get('/login', (req, res, next) => accountController.login(req, res, next))

/**
 * Route for handling login post request.
 */
router.post('/login', (req, res, next) => accountController.loginPost(req, res, next))

/**
 * Route for displaying registration form.
 */
router.get('/register', (req, res, next) => accountController.register(req, res, next))

/**
 * Route for handling registration post request.
 */
router.post('/register', (req, res, next) => accountController.registerPost(req, res, next))

/**
 * Route for handling logout process.
 */

router.get('/logout', (req, res, next) => accountController.logout(req, res, next))
