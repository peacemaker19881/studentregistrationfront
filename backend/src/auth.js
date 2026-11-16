import jwt from "jsonwebtoken";

export function createToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h", issuer: "student-registration-api" }
  );
}

export function authenticate(req, res, next) {
  const [scheme, token] = (req.get("authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authentication is required." });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { issuer: "student-registration-api" });
    next();
  } catch {
    res.status(401).json({ message: "Your session is invalid or has expired." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to do this." });
    }
    next();
  };
}
