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

\usepackage[empty]{fullpage}
\usepackage[hidelinks]{hyperref}
\usepackage{tabularx}

\addtolength{\oddsidemargin}{-0.6in}
\addtolength{\textwidth}{1.2in}
\addtolength{\topmargin}{-.7in}
\addtolength{\textheight}{1.4in}

\setlength{\parindent}{0pt}

\begin{document}

% ================= HEADER =================
\begin{center}
{\Huge \textbf{FULL NAME}} \\
Location \\
Email | Phone | Links
\end{center}

% ================= EDUCATION =================
\section*{Education}
\begin{itemize}
\item \textbf{Institution} \hfill Dates \\
Degree / Field
\end{itemize}

% ================= EXPERIENCE =================
\section*{Experience}
\begin{itemize}
\item \textbf{Role} \hfill Dates \\
Company
\begin{itemize}
\item Achievement
\item Achievement
\end{itemize}
\end{itemize}

% ================= PROJECTS =================
\section*{Projects}
\begin{itemize}
\item \textbf{Project Name} \hfill Tech Stack
\begin{itemize}
\item Description
\item Impact
\end{itemize}
\end{itemize}

% ================= SKILLS =================
\section*{Technical Skills}
\begin{itemize}
\item Languages:
\item Frameworks:
\item Tools:
\end{itemize}

% ================= CERTIFICATIONS =================
\section*{Certifications}
\begin{itemize}
\item Certification
\end{itemize}

% ================= EXTRACURRICULAR =================
\section*{Extracurricular}
\begin{itemize}
\item Activity
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
6. Do NOT use enumitem, titlesec, tikz, fontawesome, multicol, graphics.
7. Do NOT use spacing hacks like \\vspace.
8. Use simple LaTeX only.

=====================
ALLOWED COMMANDS ONLY
=====================
\\section*
\\textbf \\textit
\\href
\\begin{itemize} \\item \\end{itemize}
\\begin{tabularx}
\\\\

Nothing else.

=====================
CONTENT RULES
=====================
- Use ONLY real user data
- Do not invent info
- Tailor to job description
- ATS friendly
- 1 page

=====================
ESCAPE SPECIAL CHARACTERS
=====================
& % $ # _ { } ~ ^
must be escaped properly.

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
