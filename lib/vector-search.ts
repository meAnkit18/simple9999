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
  console.log("[Vector Search] Searching for userId:", userId);

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

    console.log("[Vector Search] Atlas results:", results?.length || 0);

    if (results.length > 0) {
      return results;
    }
  } catch (err) {
    // Vector search not available, fall back
    console.warn("[Vector Search] Atlas not available, using basic lookup:", err);
  }

  // Fallback: just get recent user documents
  console.log("[Vector Search] Using fallback - basic document lookup");
  const files = await File.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  console.log("[Vector Search] Fallback found", files?.length || 0, "files");

  // Log first file's chunk info for debugging
  if (files.length > 0 && files[0].chunks) {
    console.log("[Vector Search] First file has", files[0].chunks.length, "chunks");
  }

  return files as { chunks: { text: string }[] }[];
}
