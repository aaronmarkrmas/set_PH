import mongoose from "mongoose";

const JoinSchema = new mongoose.Schema({
  runId: { type: mongoose.Schema.Types.ObjectId, ref: "Run", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  name: { type: String, required: true }, // for non-account joiners or display name
  status: { type: String, enum: ["going", "invited", "cancelled"], default: "going" },
}, { timestamps: true });

export default mongoose.models.Join || mongoose.model("Join", JoinSchema);