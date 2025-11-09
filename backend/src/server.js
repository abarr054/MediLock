import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
// If you have records routes, keep them:
// import recordsRoutes from "./routes/records.routes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "medilock-backend" }));

app.use("/api/auth", authRoutes);
// app.use("/api/records", recordsRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 60000 })
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Mongo connect error", e.message);
    process.exit(1);
  });
