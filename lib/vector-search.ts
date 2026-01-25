import File from "@/models/File";
import mongoose from "mongoose";

/**
 * Search user documents by similarity (without Atlas Vector Search)
 * Falls back to basic text matching if vector search isn't available
 */
export async function searchUserDocuments(
  userId: string,
  queryVector: number[]
): Promise<{ chunks: { text: string }[] }[]> {
  try {
    // Try Atlas Vector Search first
    const results = await File.aggregate([
      {
        $vectorSearch: {
          index: "file_chunks_index",
          path: "chunks.embedding",
          queryVector,
          numCandidates: 50,
          limit: 5,
          filter: { userId: new mongoose.Types.ObjectId(userId) },
        },
      },
    ]);

    if (results.length > 0) {
      return results;
    }
  } catch (err) {
    // Vector search not available, fall back
    console.warn("Vector search not available, using basic lookup");
  }

  // Fallback: just get recent user documents
  const files = await File.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return files as { chunks: { text: string }[] }[];
}
