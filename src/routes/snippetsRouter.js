import express from 'express'
import { SnippetController } from '../controllers/snippetsController.js'

/**
 * Router for snippet-related routes.
 */
export const router = express.Router()

const controller = new SnippetController()

/**
 * Middleware to load the snippet document if :id is present in the route path.
 */
router.param('id', (req, res, next, id) => controller.loadSnippetDocument(req, res, next, id))

/**
 * Route for getting all snippets.
 */
router.get('/', (req, res, next) => controller.index(req, res, next))

/**
 * Routes for creating a new snippet.
 */
router.get('/create', (req, res, next) => controller.create(req, res, next))
router.post('/create',
  (req, res, next) => controller.authorize(req, res, next),
  (req, res, next) => controller.createPost(req, res, next))

/**
 * Routes for updating a snippet.
 */
router.get('/:id/update', (req, res, next) => controller.update(req, res, next))
router.post('/:id/update',
  (req, res, next) => controller.authorizeAuthor(req, res, next),
  (req, res, next) => controller.updatePost(req, res, next))

/**
 * Routes to view a snippet.
 */
router.get('/:id/view', (req, res, next) => controller.show(req, res, next))

/**
 * Routes for deleting a snippet.
 */
router.get('/:id/delete', (req, res, next) => controller.delete(req, res, next))
router.post('/:id/delete',
  (req, res, next) => controller.authorizeAuthor(req, res, next),
  (req, res, next) => controller.deletePost(req, res, next))
