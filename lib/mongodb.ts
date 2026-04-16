import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI as an environment variable");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseCache = cache;

export async function connectDB() {
  const readyState = mongoose.connection.readyState;

  // 1 = connected
  if (cache.conn && readyState === 1) {
    return cache.conn;
  }

  // If the connection dropped after being established, discard the cached promise/conn
  // so we actually reconnect on the next request.
  // 0 = disconnected, 3 = disconnecting
  if (readyState === 0 || readyState === 3) {
    cache.conn = null;
    cache.promise = null;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI as string, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 20,
        minPoolSize: 2,
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cache.conn = null;
        cache.promise = null;
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
