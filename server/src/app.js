import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
  "https://*.vercel.app",
  "https://*.netlify.app",
];
const rawOrigins = (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : DEFAULT_ORIGINS)
  .map((origin) => origin.trim())
  .filter(Boolean);

const escapeRegex = (value = "") => value.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
const wildcardToRegex = (pattern) => new RegExp(`^${escapeRegex(pattern).replace(/\\\*/g, ".*")}$`);

const allowedOrigins = rawOrigins.reduce(
  (acc, origin) => {
    if (origin.includes("*")) {
      acc.patterns.push(wildcardToRegex(origin));
    } else {
      acc.values.add(origin);
    }
    return acc;
  },
  { values: new Set(), patterns: [] }
);

const isLocalhostOrigin = (origin = "") => {
  try {
    const url = new URL(origin);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
};

const matchesAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.values.has("*") || allowedOrigins.values.has(origin)) {
    return true;
  }
  return allowedOrigins.patterns.some((regex) => regex.test(origin));
};

const corsOptions = {
  origin(origin, callback) {
    const allowLocalhost = process.env.NODE_ENV !== "production";

    if (
      matchesAllowedOrigin(origin) ||
      (allowLocalhost && isLocalhostOrigin(origin))
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (_req, res) => {
  res.json({
    name: "School Management API",
    status: "online",
    docs: "/api/health",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
