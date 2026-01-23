import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: String,
    fileType: String,
    cloudinaryUrl: String,

    // 🔥 RAG-ready chunks
    chunks: [
      {
        text: String,
        embedding: [Number],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.File ||
  mongoose.model("File", FileSchema);
