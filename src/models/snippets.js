import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

/**
 * Schema for Snippet.
 */
const Snippetschema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 1, maxlength: [20, 'Title cannot be more than 20 characters.'], trim: true },
  content: { type: String, required: true, minlength: 1, trim: true },
  author: { type: String, required: true, trim: true }
})

/**
 * Add base schema to Snippet schema.
 */
Snippetschema.add(BASE_SCHEMA)

/**
 * Model for Snippet.
 */
export const SnippetModel = mongoose.model('Snippet', Snippetschema)
