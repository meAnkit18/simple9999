import File from "@/models/File";

export async function searchUserDocuments(
  userId: string,
  queryVector: number[]
) {
  return File.aggregate([
    {
      $vectorSearch: {
        index: "file_chunks_index",
        path: "chunks.embedding",
        queryVector,
        numCandidates: 50,
        limit: 5,
      },
    },
    {
      $match: { userId },
    },
  ]);
}
