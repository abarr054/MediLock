import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) return res.status(401).json({ error: "missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = { uid: payload.uid, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
};
