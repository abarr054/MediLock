import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema(
  {
    record: { type: mongoose.Schema.Types.ObjectId, ref: "Record", required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    toEmail: { type: String, required: true, index: true }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.model("Share", ShareSchema);
