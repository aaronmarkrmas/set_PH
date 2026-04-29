import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNum: { type: String, required: false, unique: true },
  address: { type: String, required: false},
  bio: { type: String, required: false },
  bballPosition: { type: String, required: false },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  password: { type: String, required: true },
  role: { type: String, enum: ["host", "joiner"], default: "joiner" },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);