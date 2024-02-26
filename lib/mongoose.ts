import mongoose from 'mongoose'

let isConnected: boolean = false

export const connectToDB = async () => {
  mongoose.set('strictQuery', true)

  if (!process.env.MONGOOSE_URL) {
    return console.log('MISSING MONGOOSE_URL')
  }

  if (isConnected) {
    return console.log('MongoDB is already connected')
  }

  try {
    await mongoose.connect(process.env.MONGOOSE_URL, {
      dbName: 'devflow'
    })

    isConnected = true

    console.log('MongoDB is connected')
  } catch (e) {
    console.log('MongoDB connection failed', e)
  }
}
