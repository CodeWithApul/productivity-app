import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { getUserByEmail } from "./users.js";
import env from "dotenv";
env.config();
const secret = Buffer.from(process.env.JWT_SECRET, "base64");

export const authMiddleware = expressjwt({
  algorithms: ["HS256"],
  credentialsRequired: false,
  secret,
});

export async function handleLogin(req, res) {
  // check if user exists
  const user = await getUserByEmail(req.body.email);
  if (!user || user.password != req.body.password) {
    res.sendStatus(401);
  } else {
    const claim = { sub: user.id, email: user.email };
    const token = jwt.sign(claim, secret);
    res.json({ token });
  }
}
