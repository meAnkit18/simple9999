import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profileData: { type: Object, default: null },
    hasNewUploads: { type: Boolean, default: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

const User = models.User || model("User", UserSchema);
export default User;