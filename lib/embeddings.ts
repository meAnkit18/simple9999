import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

// Using BAAI/bge-base-en-v1.5 - a high-quality, free embedding model
// Produces 768-dimensional vectors
export const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY!,
  model: "BAAI/bge-base-en-v1.5",
});
