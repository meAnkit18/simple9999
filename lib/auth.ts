import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  console.log("AUTH TOKEN:", token);

  if (!token) {
    console.log("NO TOKEN FOUND");
    return null;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("DECODED TOKEN:", decoded);

    const user = await User.findById(decoded.id);
    console.log("USER FOUND:", !!user);

    return user;
  } catch (err) {
    console.log("JWT ERROR:", err);
    return null;
  }
}
