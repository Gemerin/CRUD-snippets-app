import { SnippetModel } from '../models/snippets.js'

/**
 * Encapsulates a controller.
 */
export class SnippetController {
  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the snippet to load.
   * @throws {Error} When the snippet document is not found.
   * @returns {void}
   */
  async loadSnippetDocument (req, res, next, id) {
    try {
      // Get the snippet document.
      const snippetDoc = await SnippetModel.findById(id)

      // If the snippet document is not found, throw an error.
      if (!snippetDoc) {
        const error = new Error('The snippet you requested does not exist.')
        error.status = 404
        return next(error)
      }

      // Provide the snippet document to req.
      req.doc = snippetDoc

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a list of all snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    const snippets = (await SnippetModel.find())
      .map(snippetDoc => {
        const snippet = snippetDoc.toObject()
        return snippet
      })
    const viewData = { snippets }
    res.render('snippets/index', { viewData })
    next()
  }

  /**
   * Returns a HTML form for creating a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async create (req, res) {
    res.render('snippets/create')
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createPost (req, res, next) {
    const { title, content } = req.body
    const author = req.session.user.username

    await SnippetModel.create({
      author,
      title,
      content
    })

    req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
    res.redirect('../snippets')
  }

  /**
   * Returns a HTML form for updating a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    res.render('snippets/update', { viewData: req.doc.toObject() })
  }

  /**
   * Updates a specific snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updatePost (req, res, next) {
    if ('author' in req.body) req.doc.author = req.body.author
    if ('title' in req.body) req.doc.title = req.body.title
    if ('content' in req.body) req.doc.content = req.body.content

    if (req.doc.isModified()) {
      await req.doc.save()
      req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
    } else {
      req.session.flash = { type: 'info', text: 'The snippet was not updated because there was nothing to update.' }
    }
    res.redirect('..')
  }

  /**
   * This asynchronous method handles the HTTP GET request to show a specific snippet.
   * It retrieves the ID from the request parameters and finds the corresponding snippet in the database.
   * If an error occurs during the process, it passes the error to the next middleware function.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} - This method does not return a value.
   */
  async show (req, res, next) {
    const id = req.params.id
    const snippet = await SnippetModel.findById(id)

    if (!snippet) {
      return res.status(404).send('Snippet not found')
    }

    const viewData = {
      snippet: snippet.toObject() // Convert the snippet document to a plain object
    }

    res.render('snippets/show', { viewData }) // Render the 'show' view with the snippet data
    next()
  }

  /**
   * Returns a HTML form for deleting a snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    res.render('snippets/delete', { viewData: req.doc.toObject() })
  }

  /**
   * Deletes the specified snippet.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deletePost (req, res, next) {
    try {
      await req.doc.deleteOne()

      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      next(error)
    }
  }

  /**
   * This asynchronous method checks if the user is authorized to perform an action.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authorize (req, res, next) {
    if (req.session && req.session.user) {
      next()
    } else {
      req.session.flash = { type: 'danger', text: 'You must be logged in to create a post.' }
      const err = new Error('You must be logged in to create a post.')
      err.status = 401 // Unauthorized
      next(err)
    }
  }

  /**
   * This asynchronous method checks if the logged-in user is the author of the post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authorizeAuthor (req, res, next) {
    if (!req.session.user) {
      const err = new Error('Not logged in')
      err.status = 404
      next(err)
      return
    }
    // Check if logged in user is author of post
    if (req.session.user.username !== req.doc.author) {
      const err = new Error('Not Authorized')
      err.status = 403
      next(err)
      return
    }
    next()
  }
}
