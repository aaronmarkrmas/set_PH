import mongoose from "mongoose";

const GuestJoinRequestSchema = new mongoose.Schema({
  runId: { type: mongoose.Schema.Types.ObjectId, ref: "Run", required: true },
  guestName: { type: String, required: true },
  guestContact: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.GuestJoinRequest || mongoose.model("GuestJoinRequest", GuestJoinRequestSchema);
