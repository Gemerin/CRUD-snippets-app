// mongoose is an object data modeling library for mongodb and node.js. API for manipulating data in mongodb through docker.
import mongoose from 'mongoose'

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 *
 * @param {string} connectionString - The MongoDB connection string.
 * @returns {Promise} - A promise that resolves when the connection is successful.
 * @throws {Error} - If the connection fails, a MongooseError is thrown.
 */
export const connectToDatabase = async (connectionString) => {
  const { connection } = mongoose

  /**
   * Sets Mongoose settings to prevent bugs and odd behavior.
   * Enables strict mode to throw errors when data doesn't follow the schema.
   */
  mongoose.set('strict', 'throw')

  /**
   * Enables strict mode for queries to filter out fields not in the schema.
   */
  mongoose.set('strictQuery', true)

  /**
   * Adds an event listener to the Mongoose connection object.
   * Logs a message to the console when a connection is established.
   */
  connection.on('connected', () => console.log('Mongoose connected to MongoDB'))
  connection.on('error', err => console.error(`Mongoose connection error occured ${err}`))
  connection.on('disconnected', () => console.log('Mongoose is disconnected from MongoDB'))

  // Listens to ctrl + c system shut down events on Node.js process, end connection to mongoDB.
  for (const signalEvent of ['SIGINT', 'SIGTERM']) {
    process.on(signalEvent, () => {
      (async () => {
        await connection.close()
        console.log(`Mongoose disconnected from MongoDB ${signalEvent}`)
        process.exit(0)
      })()
    })
  }
  // Connect to server
  console.log('Mongoose connected to MongoDB')
  return mongoose.connect(connectionString)
}
