import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },

    // 2FA
    twofaCode: { type: String },
    twofaExpires: { type: Date },

    // password reset
    resetCode: { type: String },
    resetExpires: { type: Date },
  },
  { timestamps: true }
);

// Important: reuse the compiled model if it exists (prevents OverwriteModelError)
export default mongoose.models.User || mongoose.model("User", UserSchema);
