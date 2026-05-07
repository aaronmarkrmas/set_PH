import mongoose from "mongoose";

const RunSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  numOfPlayers: { type: Number, required: false },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  joinCode: { type: String, unique: true, required: true },
  status: { type: String, enum: ["open", "full", "cancelled", "completed"], default: "open" },
}, { timestamps: true });

export default mongoose.models.Run || mongoose.model("Run", RunSchema);