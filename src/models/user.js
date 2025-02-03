import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { BASE_SCHEMA } from './baseSchema.js'

/**
 * Schema for User.
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    minlength: [10, 'The password must be a minium length of 10 characters.'],
    required: true
  }
})
userSchema.add(BASE_SCHEMA)

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

/**
 * Authenticate a user.
 *
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<object>} The authenticated user.
 * @throws {Error} If the username is not found or the password is incorrect.
 */
userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt.')
  }
  return user
}

/**
 * Model for User.
 */
export const UserModel = mongoose.model('User', userSchema)
