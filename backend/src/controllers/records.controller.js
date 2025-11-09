import Record from "../models/Record.js";
import Share from "../models/Share.js";
import User from "../models/User.js";

/**
 * POST /api/records/upload
 * body: { fileName, mimeType, dataB64 }
 */
export const uploadRecord = async (req, res) => {
  try {
    const { fileName, mimeType, dataB64 } = req.body;
    if (!fileName || !mimeType || !dataB64) {
      return res.status(400).json({ error: "missing fields" });
    }
    const size = Buffer.byteLength(dataB64, "base64");
    const rec = await Record.create({
      owner: req.user.uid,
      fileName,
      mimeType,
      size,
      dataB64
    });
    return res.json({ ok: true, id: rec._id.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "upload failed" });
  }
};

/**
 * GET /api/records/mine
 */
export const listMine = async (req, res) => {
  const recs = await Record.find({ owner: req.user.uid })
    .select("_id fileName size createdAt")
    .sort({ createdAt: -1 });
  res.json({ ok: true, records: recs });
};

/**
 * POST /api/records/share
 * body: { recordId, toEmail, wrappedKey? }
 */
export const shareRecord = async (req, res) => {
  try {
    const { recordId, toEmail } = req.body;
    if (!recordId || !toEmail) return res.status(400).json({ error: "missing fields" });

    const rec = await Record.findOne({ _id: recordId, owner: req.user.uid });
    if (!rec) return res.status(404).json({ error: "record not found" });

    const share = await Share.create({
      record: rec._id,
      from: req.user.uid,
      toEmail: toEmail.toLowerCase().trim()
    });

    return res.json({ ok: true, shareId: share._id.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "share failed" });
  }
};

/**
 * GET /api/records/shared-with-me
 */
export const sharedWithMe = async (req, res) => {
  const me = await User.findById(req.user.uid).select("email");
  const shares = await Share.find({ toEmail: me.email.toLowerCase() })
    .populate("record", "_id fileName size createdAt")
    .sort({ createdAt: -1 });

  const mapped = shares.map((s) => ({
    id: s._id.toString(),
    recordId: s.record?._id?.toString(),
    fileName: s.record?.fileName,
    size: s.record?.size,
    createdAt: s.createdAt
  }));
  res.json({ ok: true, shares: mapped });
};

/**
 * GET /api/records/:id  (download if owner or shared recipient)
 */
export const downloadRecord = async (req, res) => {
  const id = req.params.id;
  const rec = await Record.findById(id);
  if (!rec) return res.status(404).send("not found");

  // allowed if owner
  const isOwner = rec.owner?.toString() === req.user.uid;

  // or allowed if shared to me
  let canView = isOwner;
  if (!canView) {
    const me = await User.findById(req.user.uid).select("email");
    const share = await Share.findOne({
      record: rec._id,
      toEmail: me.email.toLowerCase()
    });
    canView = !!share;
  }

  if (!canView) return res.status(403).send("forbidden");

  const buf = Buffer.from(rec.dataB64, "base64");
  res.setHeader("Content-Type", rec.mimeType);
  res.setHeader("Content-Length", buf.length);
  res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(rec.fileName)}"`);
  return res.end(buf);
};
