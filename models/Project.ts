import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalPrompt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  chatHistory: {
  type: [
    {
      role: String,
      content: String,
    },
  ],
  default: [],
},

});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
