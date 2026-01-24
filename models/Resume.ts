import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  latexCode: {
    type: String,
    required: true,
  },
  version: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Resume ||
  mongoose.model("Resume", ResumeSchema);
