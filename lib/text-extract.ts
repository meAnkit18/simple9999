import { PdfReader } from "pdfreader";

export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  // ✅ PDF extraction (safe, Node-only)
  if (mimeType === "application/pdf") {
    return new Promise((resolve, reject) => {
      let text = "";

      try {
        new PdfReader().parseBuffer(buffer, (err, item) => {
          if (err) return reject(err);

          if (!item) {
            resolve(text);
          } else if (item.text) {
            text += item.text + " ";
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // ❌ Images disabled for now (prevents OCR crashes)
  return "";
}
