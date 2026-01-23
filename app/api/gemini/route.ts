import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set in environment variables");
}

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const LATEX_SYSTEM_INSTRUCTION = `
You are an expert LaTeX developer specializing in resume creation. 
Your goal is to generate clean, professional, and compilable LaTeX code for resumes.
Always use standard packages (geometry, enumitem, hyperref, titlesec).
Ensure the layout is modern and readable.
If the user asks for changes, modify the provided LaTeX code accordingly while maintaining structural integrity.
`;

// Convert text to LaTeX
export async function POST(request: NextRequest) {
    if (!ai) {
        return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    try {
        const { action, rawText, latexCode, userPrompt } = await request.json();

        if (action === "convert") {
            // Convert raw text to LaTeX
            const prompt = `
        Convert the following raw text extracted from a resume PDF into a complete, one-page professional LaTeX resume.
        
        RAW TEXT:
        ${rawText}
        
        Requirements:
        1. Use the 'article' class.
        2. Use 'titlesec' to format section headers.
        3. Keep the design clean (ModernCV style or similar custom implementation is fine, but keep it in a single file if possible).
        4. Ensure all special characters are properly escaped.
        5. Infer sections like Education, Experience, Skills, Projects from the text.
        6. Return ONLY the raw LaTeX code. No intro, no outro.
      `;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
                config: {
                    systemInstruction: LATEX_SYSTEM_INSTRUCTION,
                    temperature: 0.2,
                }
            });

            let code = response.text || "";
            code = code.replace(/^```latex\s*/i, "").replace(/```$/, "");

            return NextResponse.json({ latex: code.trim() });

        } else if (action === "update") {
            // Update LaTeX with user prompt
            const prompt = `
        Current LaTeX Code:
        ${latexCode}
        
        User Request:
        "${userPrompt}"
        
        Task:
        Update the LaTeX code to fulfill the user's request. 
        Maintain the overall structure unless asked to change it.
        
        Return a JSON object with the following structure:
        {
          "latex": "The full updated LaTeX code",
          "summary": "A brief, friendly, 1-sentence explanation of what you changed (e.g., 'I made the section headers bold and increased the spacing.')"
        }
      `;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
                config: {
                    systemInstruction: LATEX_SYSTEM_INSTRUCTION,
                    responseMimeType: "application/json",
                }
            });

            const responseText = response.text || "{}";
            const data = JSON.parse(responseText);

            return NextResponse.json({
                latex: data.latex || latexCode,
                summary: data.summary || "Updates applied successfully."
            });

        } else if (action === "preview") {
            // Generate HTML preview from LaTeX
            const prompt = `
        Convert the following LaTeX resume code into a single, semantic HTML file with inline CSS.
        
        LATEX CODE:
        ${latexCode?.substring(0, 15000)}
        
        Requirements:
        1. The output must be a single raw HTML string. No markdown blocks.
        2. Use inline CSS to mimic the visual style of the LaTeX document (fonts, spacing, layout).
        3. Use a white background, standard resume fonts (Times, Arial, or similar serif/sans-serif depending on the latex font).
        4. Ensure the layout looks like an A4 or Letter paper.
        5. Make it look professional and clean.
        6. Do not explain anything, just return the HTML.
      `;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
                config: {
                    temperature: 0.3,
                }
            });

            let html = response.text || "";
            html = html.replace(/^```html\s*/i, "").replace(/```$/, "");

            return NextResponse.json({ html: html.trim() });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "AI processing failed" }, { status: 500 });
    }
}
