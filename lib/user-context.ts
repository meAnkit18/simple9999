import { embeddings } from "@/lib/embeddings";
import { searchUserDocuments } from "@/lib/vector-search";

export async function getUserContextFromPrompt(
  userId: string,
  prompt: string
) {
  const embedding = await embeddings.embedQuery(prompt);
  const results = await searchUserDocuments(userId, embedding);

  return results
    .map((doc: any) =>
      doc.chunks?.map((c: any) => c.text).join("\n")
    )
    .join("\n\n");
}
