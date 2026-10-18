import { Schema, model, models } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, default: "" },
  },
  { timestamps: true }
);

const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);
export default BlogPost;