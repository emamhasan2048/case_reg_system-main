import mongoose from "mongoose"

const MONGO_DB = "future_cases"
const MONGODB_URI =
  "mongodb://case_record:O1IP0oNcW7AYJnsA@cluster0-shard-00-00.xanfm.mongodb.net:27017,cluster0-shard-00-01.xanfm.mongodb.net:27017,cluster0-shard-00-02.xanfm.mongodb.net:27017/future_cases?ssl=true&replicaSet=atlas-665p7o-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache
}

const cached = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
}

globalWithMongoose.mongooseCache = cached

export async function connectMongo() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGO_DB,
      serverSelectionTimeoutMS: 5000,
    })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    cached.promise = null
    throw error
  }
}
