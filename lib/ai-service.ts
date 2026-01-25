import { ChatGroq } from "@langchain/groq";

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
});

const LATEX_SYSTEM = `You are an expert LaTeX resume builder. Generate clean, compilable LaTeX code.
Use standard packages: geometry, enumitem, hyperref, titlesec.
Keep layouts modern and professional. One page if possible.`;

/**
 * Generate a new LaTeX resume from a prompt and user context
 */
export async function generateResume(
    prompt: string,
    userContext: string
): Promise<string> {
    const fullPrompt = `${LATEX_SYSTEM}

User Request: "${prompt}"

${userContext ? `Relevant context from user's documents:\n${userContext}` : ""}

Generate a complete, professional LaTeX resume based on the request.
If context is provided, incorporate relevant experience/skills.
Return ONLY the raw LaTeX code, no markdown blocks.`;

    const response = await model.invoke(fullPrompt);
    let latex = response.content as string;

    // Clean markdown code blocks if present
    latex = latex.replace(/^```latex\s*/i, "").replace(/```\s*$/, "");
    return latex.trim();
}

/**
 * Edit existing LaTeX based on user instruction
 */
export async function editResume(
    currentLatex: string,
    instruction: string
): Promise<{ latex: string; summary: string }> {
    const prompt = `${LATEX_SYSTEM}

Current LaTeX Resume:
${currentLatex}

User Instruction: "${instruction}"

Modify the LaTeX to fulfill the user's request. Maintain structure unless asked to change it.

Respond with JSON:
{
  "latex": "the full updated LaTeX code",
  "summary": "brief 1-sentence explanation of changes"
}`;

    const response = await model.invoke(prompt);
    let text = response.content as string;

    // Clean markdown
    text = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "");

    try {
        const data = JSON.parse(text);
        return {
            latex: data.latex || currentLatex,
            summary: data.summary || "Changes applied.",
        };
    } catch {
        // If JSON parse fails, assume the response is just LaTeX
        return {
            latex: text.trim() || currentLatex,
            summary: "Changes applied.",
        };
    }
}

/**
 * Generate HTML preview from LaTeX
 */
export async function generatePreview(latexCode: string): Promise<string> {
    const prompt = `Convert this LaTeX resume to semantic HTML with inline CSS.
Make it look like a professional resume on white A4 paper.
Use professional fonts and proper spacing.

LATEX:
${latexCode.substring(0, 15000)}

Return ONLY raw HTML, no markdown blocks.`;

    const response = await model.invoke(prompt);
    let html = response.content as string;
    html = html.replace(/^```html\s*/i, "").replace(/```\s*$/, "");
    return html.trim();
}
