import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

/* ------------------------ helpers ------------------------ */

async function sendMailOrConsole(to, subject, text) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  if (host && user && pass) {
    const tx = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
    await tx.sendMail({ from: user, to, subject, text });
  } else {
    console.log(`[MAIL -> ${to}] ${subject}\n${text}`);
  }
}

function sign(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "2h" });
}

/* ------------------------ controllers ------------------------ */

// POST /auth/register  { email, password }
export async function register(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, error: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.json({ ok: false, error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash: hash });
    return res.json({ ok: true });
  } catch (e) {
    console.error("register error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

// POST /auth/login  { email, password }  -> sends 2FA code and ALWAYS logs it
export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, error: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: false, error: "Invalid credentials" });

    const good = await bcrypt.compare(password, user.passwordHash || "");
    if (!good) return res.json({ ok: false, error: "Invalid credentials" });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    user.twofaCode = code;
    user.twofaExpires = expires;
    await user.save();

    // Always print the code to backend console so you can use it immediately
    console.log("2FA code for", email, "is", code);

    // Try sending email if SMTP is configured. Any failure here will not block login.
    try {
      await sendMailOrConsole(
        email,
        "Your MediLock 2FA code",
        `Your code: ${code} (expires in 5 minutes)`
      );
    } catch (mailErr) {
      console.warn("2FA email send failed:", mailErr?.message || mailErr);
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error("login error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

// POST /auth/verify2fa  { email, code }  -> returns JWT
export async function verify2fa(req, res) {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) return res.status(400).json({ ok: false, error: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user || !user.twofaCode || !user.twofaExpires)
      return res.status(400).json({ ok: false, error: "Invalid or expired code" });

    if (new Date(user.twofaExpires).getTime() < Date.now())
      return res.status(400).json({ ok: false, error: "Code expired" });

    if (String(user.twofaCode) !== String(code))
      return res.status(400).json({ ok: false, error: "Invalid code" });

    user.twofaCode = undefined;
    user.twofaExpires = undefined;
    await user.save();

    const token = sign(user);
    return res.json({ ok: true, token });
  } catch (e) {
    console.error("verify2fa error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

// GET /auth/me  -> returns user from Bearer token
export async function me(req, res) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ ok: false, error: "No token" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).select("email createdAt");
    if (!user) return res.status(404).json({ ok: false, error: "Not found" });

    return res.json({ ok: true, user });
  } catch (e) {
    return res.status(401).json({ ok: false, error: "Invalid token" });
  }
}

// POST /auth/request-reset  { email }
export async function requestReset(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ ok: false, error: "Missing email" });

    const user = await User.findOne({ email });
    // respond ok regardless to avoid user enumeration
    if (!user) return res.json({ ok: true });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.resetCode = code;
    user.resetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendMailOrConsole(email, "MediLock password reset code", `Your reset code: ${code} (valid 15 minutes)`);
    console.log("Password reset code for", email, "is", code);

    return res.json({ ok: true });
  } catch (e) {
    console.error("requestReset error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

// POST /auth/reset-password  { email, code, newPassword }
export async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body || {};
    if (!email || !code || !newPassword) return res.status(400).json({ ok: false, error: "Missing fields" });

    const user = await User.findOne({ email });
    if (
      !user ||
      !user.resetCode ||
      !user.resetExpires ||
      new Date(user.resetExpires).getTime() < Date.now() ||
      String(user.resetCode) !== String(code)
    ) {
      return res.status(400).json({ ok: false, error: "Invalid reset" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetExpires = undefined;
    await user.save();

    return res.json({ ok: true });
  } catch (e) {
    console.error("resetPassword error:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
