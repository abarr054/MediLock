import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  uploadRecord,
  listMine,
  shareRecord,
  sharedWithMe,
  downloadRecord
} from "../controllers/records.controller.js";

const r = Router();

// protected record routes
r.post("/upload", auth, uploadRecord);
r.get("/mine", auth, listMine);
r.post("/share", auth, shareRecord);
r.get("/shared-with-me", auth, sharedWithMe);
r.get("/:id", auth, downloadRecord);

export default r;
