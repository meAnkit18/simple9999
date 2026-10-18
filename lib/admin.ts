import { getUserFromToken } from "./auth";
import { connectDB } from "./db";
import User from "@/models/User";

export async function getCurrentUser() {
  const userId = await getUserFromToken();
  if (!userId) return null;
  await connectDB();
  const user = await User.findById(userId).lean();
  return user ? { id: user._id.toString(), name: user.name, email: user.email, role: user.role || "user" } : null;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  // Allow env-based admin override for bootstrapping.
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (adminEmails.includes(user.email.toLowerCase())) return true;
  return user.role === "admin";
}