import dotenv from "dotenv";
import http from "http";
import process from "node:process";
import app from "./app.js";
import connectDB, { disconnectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const bootstrap = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

const shutdown = (signal) => {
  console.log(`${signal} received. Gracefully shutting down.`);

  server.close(async (closeError) => {
    if (closeError) {
      console.error("Error while closing HTTP server", closeError);
    }

    try {
      await disconnectDB();
    } catch (error) {
      console.error("Error while closing Mongo connection", error.message);
    } finally {
      process.exit(closeError ? 1 : 0);
    }
  });
};

bootstrap().catch((error) => {
  console.error("Failed to bootstrap server", error);
  process.exit(1);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal);
  });
});
