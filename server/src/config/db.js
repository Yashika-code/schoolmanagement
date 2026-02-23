import mongoose from "mongoose";

let memoryServer = null;

const shouldUseInMemory = () => process.env.USE_IN_MEMORY_DB === "true" || !process.env.MONGO_URI;

const startInMemoryServer = async () => {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const binaryVersion = process.env.MONGOMS_VERSION || "4.4.29";

  memoryServer = await MongoMemoryServer.create({
    binary: {
      version: binaryVersion,
    },
  });

  console.warn(
    `[DB] No Mongo connection string detected. Using in-memory MongoDB ${binaryVersion} at ${memoryServer.getUri()}`
  );
  return memoryServer.getUri();
};

const getMongoUri = async () => {
  if (shouldUseInMemory()) {
    return startInMemoryServer();
  }

  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI is not defined and in-memory fallback is disabled. Set MONGO_URI or USE_IN_MEMORY_DB=true."
    );
  }

  return process.env.MONGO_URI;
};

const connectDB = async () => {
  try {
    const mongoUri = await getMongoUri();
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    const suffix = memoryServer ? " (in-memory)" : "";
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}${suffix}`);
    return conn;
  } catch (error) {
    console.error("Mongo connection error", error.message);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

export default connectDB;
