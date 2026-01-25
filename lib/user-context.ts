import { embeddings } from "@/lib/embeddings";
import { searchUserDocuments } from "@/lib/vector-search";

export async function getUserContextFromPrompt(
  userId: string,
  prompt: string
) {
  console.log("[User Context] Getting context for userId:", userId);

  const embedding = await embeddings.embedQuery(prompt);
  console.log("[User Context] Embedding generated, dimensions:", embedding?.length);

  const results = await searchUserDocuments(userId, embedding);
  console.log("[User Context] Found", results?.length || 0, "documents");

  const context = results
    .map((doc: { chunks?: { text: string }[] }) =>
      doc.chunks?.map((c) => c.text).join("\n")
    )
    .filter(Boolean)
    .join("\n\n");

  console.log("[User Context] Total context length:", context?.length || 0);

  return context;
}
