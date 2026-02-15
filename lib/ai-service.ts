import { UserProfile, formatProfileForAI } from "./user-profile";
import { invokeLLM } from "./llm-client";

/* =========================================================
   ULTRA SAFE LATEX TEMPLATE
   - no macros
   - no fancy packages
   - only primitives
   - tectonic safe
========================================================= */

const LATEX_TEMPLATE = String.raw`
\documentclass[letterpaper,11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage[margin=1in]{geometry}
\usepackage[hidelinks]{hyperref}
\usepackage{tabularx}
\usepackage{enumitem}

\pagestyle{empty}

\setlist[itemize]{leftmargin=*}

\begin{document}

% ================= HEADER =================
\begin{center}
{\Huge \textbf{FULL NAME}} \\
\vspace{2mm}
Location \\
\vspace{1mm}
\href{mailto:email@example.com}{email@example.com} \ \textbullet \ \href{tel:+1234567890}{+1 234 567 890} \ \textbullet \ \href{https://linkedin.com/in/username}{LinkedIn}
\end{center}

\vspace{5mm}

% ================= EDUCATION =================
\section*{Education}
\vspace{-2mm}
\hrule
\vspace{2mm}
\begin{itemize}[noitemsep]
\item \textbf{Institution} \hfill Dates \\
Degree / Field
\end{itemize}

\vspace{3mm}

% ================= EXPERIENCE =================
\section*{Experience}
\vspace{-2mm}
\hrule
\vspace{2mm}
\begin{itemize}[noitemsep]
\item \textbf{Role} \hfill Dates \\
\textit{Company}
\begin{itemize}
\item Achievement
\item Achievement
\end{itemize}
\end{itemize}

\vspace{3mm}

% ================= PROJECTS =================
\section*{Projects}
\vspace{-2mm}
\hrule
\vspace{2mm}
\begin{itemize}[noitemsep]
\item \textbf{Project Name} \hfill Tech Stack
\begin{itemize}
\item Description
\item Impact
\end{itemize}
\end{itemize}

\vspace{3mm}

% ================= SKILLS =================
\section*{Technical Skills}
\vspace{-2mm}
\hrule
\vspace{2mm}
\begin{itemize}[noitemsep]
\item \textbf{Languages}:
\item \textbf{Frameworks}:
\item \textbf{Tools}:
\end{itemize}

\end{document}
`;

/* =========================================================
   LLM SYSTEM PROMPT (HARDENED FOR RELIABILITY)
========================================================= */

const LATEX_SYSTEM = `
You are a LaTeX resume generator.

Your output MUST compile successfully with Tectonic.

=====================
STRICT RULES
=====================
1. Output ONLY raw LaTeX (no markdown).
2. NEVER create custom commands or macros.
3. NEVER define \\newcommand.
4. Every \\item must be inside \\begin{itemize}.
5. Always close environments.
6. Do NOT use fontawesome, tikz, multicol, graphics.
7. Use \\textbf{} for bold, \\textit{} for italics.
8. Use \\textbullet for bullet points in text (e.g., between links).
9. Do NOT use | (pipe) directly in text, use \\textbullet or \\hspace.
10. Escape special characters: & % $ # _ { } ~ ^
11. Use 'enumitem' package for lists (already included).
12. Use \\hrule for section dividers.

=====================
ALLOWED COMMANDS ONLY
=====================
\\section*
\\textbf \\textit \\textbullet
\\href
\\begin{itemize}[noitemsep] \\item \\end{itemize}
\\begin{tabularx}
\\vspace \\hspace \\hrule
\\\\

Nothing else.

=====================
CONTENT RULES
=====================
- Use ONLY real user data
- Do not invent info
- Tailor to job description
- ATS friendly
- 1 page limit (be concise)

Remember:
SIMPLE LATEX = ZERO ERRORS
`;

/* =========================================================
   GENERATE RESUME
========================================================= */

export async function generateResume(
  companyRequirements: string,
  userProfile: UserProfile | null,
  rawContext?: string
): Promise<string> {

  let prompt = `${LATEX_SYSTEM}

TEMPLATE TO FOLLOW EXACTLY:
${LATEX_TEMPLATE}
`;

  // -------- user profile --------
  if (userProfile && (userProfile.fullName || userProfile.rawText)) {
    const formatted = formatProfileForAI(userProfile);

    prompt += `
===== USER DATA =====
${formatted}
`;

    if (userProfile.rawText && formatted.length < 500) {
      prompt += `
Additional raw text:
${userProfile.rawText.substring(0, 8000)}
`;
    }

    prompt += `===== END USER DATA =====\n`;
  }
  else if (rawContext) {
    prompt += `
===== RAW DOCUMENT DATA =====
${rawContext.substring(0, 10000)}
===== END =====
`;
  }

  // -------- job requirements --------
  prompt += `
===== JOB REQUIREMENTS =====
${companyRequirements}
Tailor resume to match these requirements.
===== END =====

Generate the final LaTeX resume now.
`;

  console.log("[AI] Generating resume...");

  const res = await invokeLLM(prompt, { temperature: 0.2 });

  let latex = res.content;

  // remove accidental markdown
  latex = latex.replace(/^```[\s\S]*?\n/, "").replace(/```$/, "");

  return latex.trim();
}

/* =========================================================
   EDIT EXISTING RESUME
========================================================= */

export async function editResume(
  currentLatex: string,
  instruction: string,
  inlineContext?: string
): Promise<{ latex: string; summary: string }> {

  // Safety truncation to avoid context limits
  const safeLatex = currentLatex.length > 20000 ? currentLatex.substring(0, 20000) + "\n... (truncated)" : currentLatex;
  const safeInstruction = instruction.length > 5000 ? instruction.substring(0, 5000) + "\n... (truncated)" : instruction;

  let prompt = `
${LATEX_SYSTEM}

Current LaTeX:
${safeLatex}

Instruction:
${safeInstruction}
`;

  if (inlineContext) {
    const safeContext = inlineContext.length > 10000 ? inlineContext.substring(0, 10000) + "\n... (truncated)" : inlineContext;
    prompt += `\nExtra context:\n${safeContext}`;
  }

  prompt += `
Return the response in this EXACT format (do not use JSON):

SUMMARY: [Brief summary of changes]
LATEX:
[The complete LaTeX code]
`;

  try {
    const res = await invokeLLM(prompt, { temperature: 0.2 });
    const text = res.content;

    // Robust parsing using simple markers
    const summaryMatch = text.match(/SUMMARY:\s*([^\n]*)/i);
    const latexMatch = text.match(/LATEX:\s*([\s\S]*)/i);

    if (latexMatch) {
      let latex = latexMatch[1].trim();
      // Remove any trailing markdown code block markers if present
      latex = latex.replace(/^```latex\s*/i, "").replace(/```$/, "").trim();

      return {
        latex: latex,
        summary: summaryMatch ? summaryMatch[1].trim() : "Changes applied"
      };
    }

    // Fallback: If no markers found, check if the whole response looks like LaTeX
    if (text.includes("\\documentclass")) {
      let latex = text.replace(/^```latex\s*/i, "").replace(/```$/, "").trim();
      return {
        latex: latex,
        summary: "Changes applied (auto-detected)"
      };
    }

    throw new Error("Could not parse response format");

  } catch (err) {
    console.error("Edit resume failed:", err);
    return {
      latex: currentLatex,
      summary: "Failed to apply changes (AI error)"
    };
  }
}

/* =========================================================
   GENERATE HTML PREVIEW
========================================================= */

export async function generatePreview(latexCode: string): Promise<string> {

  const prompt = `
Convert this LaTeX resume into clean HTML with inline CSS.
White A4 layout. Professional look.
Return ONLY raw HTML.

${latexCode.substring(0, 15000)}
`;

  const res = await invokeLLM(prompt, { temperature: 0.2 });

  return res.content
    .replace(/^```html\s*/i, "")
    .replace(/```$/, "")
    .trim();
}

/* =========================================================
   ATS SCORE CHECKER
   ========================================================= */

export interface AtsResult {
  score: number;
  strengths: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export async function checkAtsCompatibility(
  resumeText: string,
  jobDescription: string
): Promise<AtsResult> {

  const prompt = `
You are an expert ATS (Applicant Tracking System) Analyzer.
Your task is to compare a RESUME against a JOB DESCRIPTION and provide a compatibility score and actionable feedback.

JOB DESCRIPTION:
${jobDescription.substring(0, 5000)}

RESUME TEXT:
${resumeText.substring(0, 10000)}

Analyze the match based on:
1. Keyword matching (Hard skills, Soft skills, Tools)
2. Experience relevance
3. Education adjustments (if required)

Return the result in this EXACT JSON format (no markdown, just raw JSON):
{
  "score": <number between 0 and 100>,
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", ...],
  "suggestions": ["<specific actionable suggestion 1>", "<suggestion 2>", ...]
}

Be strict but fair. A score above 80 should be hard to get.
`;

  console.log("[AI] Analyzing ATS Score...");

  try {
    const res = await invokeLLM(prompt, { temperature: 0.2 });
    let content = res.content.trim();

    // Clean up markdown code blocks if present
    content = content.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "");

    const result = JSON.parse(content);

    // Validate structure
    return {
      score: typeof result.score === 'number' ? result.score : 0,
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      missingKeywords: Array.isArray(result.missingKeywords) ? result.missingKeywords : [],
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : []
    };

  } catch (err) {
    console.error("ATS Check failed:", err);
    // Return a safe fallback instead of crashing
    return {
      score: 0,
      strengths: [],
      missingKeywords: [],
      suggestions: ["Failed to analyze resume. Please try again."]
    };
  }
}
