// import { UserProfile, formatProfileForAI } from "./user-profile";
// import { invokeLLM } from "./llm-client";

// // Professional LaTeX Resume Template
// const LATEX_TEMPLATE = String.raw`
// \documentclass[letterpaper,11pt]{article}

// % ================= PACKAGES =================
// \usepackage[empty]{fullpage}
// \usepackage{titlesec}
// \usepackage[hidelinks]{hyperref}
// \usepackage{enumitem}
// \usepackage{tabularx}

// % ================= LAYOUT =================
// \addtolength{\oddsidemargin}{-0.6in}
// \addtolength{\textwidth}{1.2in}
// \addtolength{\topmargin}{-.7in}
// \addtolength{\textheight}{1.4in}

// \setlength{\parindent}{0pt}
// \setlist[itemize]{leftmargin=0.25in, noitemsep}

// % ================= SECTION STYLE =================
// \titleformat{\section}{\large\bfseries}{}{0em}{}[\titlerule]

// % ================= SAFE COMMANDS =================
// % These DO NOT hide \item internally (LLM safe)

// \newcommand{\resumeSection}[1]{\section*{#1}}

// \newcommand{\resumeHeading}[4]{
// \textbf{#1} \hfill #2 \\
// \textit{#3} \hfill \textit{#4} \\
// }

// \newcommand{\resumeItem}[1]{\item #1}

// % ================= DOCUMENT =================
// \begin{document}

// % ================= HEADER =================
// \begin{center}
// {\Huge \textbf{FULL NAME}} \\
// Location \\
// Email | Phone | Links
// \end{center}


// % ================= EDUCATION =================
// \resumeSection{Education}
// \begin{itemize}

// \item
// \resumeHeading
//   {INSTITUTION NAME}
//   {DATES}
//   {DEGREE / FIELD}
//   {EXTRA INFO}

// \end{itemize}


// % ================= EXPERIENCE =================
// \resumeSection{Experience}
// \begin{itemize}

// \item
// \resumeHeading
//   {ROLE / POSITION}
//   {DATES}
//   {COMPANY}
//   {LOCATION}

// \begin{itemize}
//   \resumeItem{Achievement or responsibility}
//   \resumeItem{Achievement or responsibility}
// \end{itemize}

// \end{itemize}


// % ================= PROJECTS =================
// \resumeSection{Projects}
// \begin{itemize}

// \item
// \resumeHeading
//   {PROJECT NAME}
//   {TECH STACK}
//   {SHORT DESCRIPTION}
//   {}

// \begin{itemize}
//   \resumeItem{What you built}
//   \resumeItem{Impact or result}
// \end{itemize}

// \end{itemize}


// % ================= SKILLS =================
// \resumeSection{Technical Skills}
// \begin{itemize}
// \resumeItem{\textbf{Languages:} }
// \resumeItem{\textbf{Frameworks:} }
// \resumeItem{\textbf{Tools:} }
// \end{itemize}


// % ================= CERTIFICATIONS =================
// \resumeSection{Certifications}
// \begin{itemize}
// \resumeItem{}
// \end{itemize}


// % ================= EXTRACURRICULAR =================
// \resumeSection{Extracurricular}
// \begin{itemize}
// \resumeItem{}
// \end{itemize}


// \end{document}


// `;

// const LATEX_SYSTEM = `
// You are a professional LaTeX resume generator.

// Your goal is to output CLEAN, COMPILABLE, ATS-friendly LaTeX that NEVER fails to compile.

// =====================
// CRITICAL COMPILATION RULES (MOST IMPORTANT)
// =====================
// 1. Output ONLY raw LaTeX. No markdown, no backticks, no explanations.
// 2. The code MUST compile with Tectonic or standard LaTeX without errors.
// 3. NEVER invent new commands or macros.
// 4. NEVER create custom \\item commands.
// 5. Every \\item MUST be inside \\begin{itemize} ... \\end{itemize}.
// 6. Always properly close every environment.
// 7. Never nest itemize incorrectly.
// 8. Do not use negative \\vspace or spacing hacks.
// 9. Do not add extra packages unless absolutely necessary.
// 10. Prefer simple LaTeX primitives only.

// =====================
// ALLOWED LATEX ONLY
// =====================
// You may use ONLY:
// - \\section or \\section*
// - \\textbf \\textit \\small
// - \\href
// - \\begin{itemize} \\item \\end{itemize}
// - \\begin{tabular*} or \\begin{tabular}
// - basic spacing like \\\\

// Do NOT use:
// - tikz
// - fontawesome
// - svg
// - multicol
// - titlesec
// - enumitem
// - custom spacing tricks
// - custom macros
// - graphics or icons

// =====================
// STRUCTURE RULES
// =====================
// Follow this simple structure EXACTLY:

// Header (name + contact)
// Education
// Experience
// Projects
// Skills
// Certifications (optional)
// Extracurricular (optional)

// Each section:
// - Use \\section*{Title}
// - Use itemize lists
// - Use simple bullets
// - Keep layout clean and professional
// - Fit on one page

// =====================
// STYLE RULES
// =====================
// - Professional, ATS-friendly
// - No icons
// - No colors required
// - No complex formatting
// - Clean text only

// Remember:
// SIMPLE LATEX = ZERO COMPILATION ERRORS.
// Always choose simpler syntax over fancy formatting.
// `;


// /**
//  * Generate a tailored LaTeX resume based on:
//  * 1. User's profile data (from their uploaded documents)
//  * 2. Company/job requirements (what the user is asking for)
//  */
// export async function generateResume(
//   companyRequirements: string,
//   userProfile: UserProfile | null,
//   rawContext?: string
// ): Promise<string> {
//   let fullPrompt = `${LATEX_SYSTEM}

// TEMPLATE STRUCTURE TO USE:
// ${LATEX_TEMPLATE}

// `;

//   // First: User's profile data
//   if (userProfile && (userProfile.fullName || userProfile.rawText)) {
//     const formattedProfile = formatProfileForAI(userProfile);

//     fullPrompt += `===== USER'S PERSONAL PROFILE =====
// The following is the user's REAL professional data extracted from their uploaded documents 
// (LinkedIn PDF, certificates, old resumes, etc). You MUST use this information:

// ${formattedProfile}
// `;

//     // If we have raw text and the formatted profile seems incomplete, add it
//     if (userProfile.rawText && formattedProfile.length < 500) {
//       fullPrompt += `
// Additional Raw Data from Documents:
// ${userProfile.rawText.substring(0, 8000)}
// `;
//     }

//     fullPrompt += `===== END USER PROFILE =====

// `;
//   } else if (rawContext && rawContext.trim().length > 50) {
//     // Fallback to raw context if no structured profile
//     fullPrompt += `===== USER'S DOCUMENT DATA =====
// ${rawContext.substring(0, 10000)}
// ===== END USER DATA =====

// `;
//   }

//   // ================= COMPANY REQUIREMENTS =================
//   fullPrompt += `
// ===== COMPANY / JOB REQUIREMENTS =====
// Target role:
// "${companyRequirements}"

// Tailor the resume by:
// - highlighting relevant skills and experience
// - emphasizing measurable achievements
// - matching keywords to the job description
// - prioritizing the most relevant projects first
// ===== END REQUIREMENTS =====
// `;


//   // ================= LATEX GENERATION RULES =================
//   fullPrompt += `
// GENERATE THE RESUME NOW.

// CRITICAL: The LaTeX MUST compile successfully with Tectonic.
// If the code does not compile, the output is considered WRONG.

// =====================
// COMPILATION SAFETY RULES (MOST IMPORTANT)
// =====================
// 1. Output ONLY raw LaTeX (no markdown, no explanations).
// 2. Use ONLY simple standard LaTeX commands.
// 3. NEVER create custom commands or macros.
// 4. NEVER use commands like \\resumeSubheading, \\resumeProjectHeading, \\resumeItemListStart, etc.
// 5. Every \\item MUST be inside \\begin{itemize} ... \\end{itemize}.
// 6. Always properly close all environments.
// 7. Do NOT use negative \\vspace or spacing tricks.
// 8. Do NOT use extra packages (enumitem, titlesec, tikz, fontawesome, multicol, graphics, etc.).
// 9. Prefer simple structure over fancy formatting.

// =====================
// ALLOWED LATEX ONLY
// =====================
// You may use ONLY:
// - \\section or \\section*
// - \\textbf \\textit
// - \\href
// - \\begin{itemize} \\item \\end{itemize}
// - \\begin{tabular*}
// - \\\\ for line breaks

// Nothing else.

// =====================
// REQUIRED STRUCTURE
// =====================
// Follow this exact structure:

// Header (centered name + contact)
// Education
// Experience
// Projects
// Technical Skills
// Certifications (optional)
// Extracurricular (optional)

// Each section:
// - use \\section*{Section Name}
// - use bullet lists
// - keep formatting simple
// - keep to one page

// =====================
// CONTENT RULES
// =====================
// - Use ONLY real information from the user's profile
// - Do NOT invent data
// - Omit missing sections instead of fabricating
// - Tailor content to the job description
// - Keep ATS-friendly and professional

// =====================
// SPECIAL CHARACTER SAFETY
// =====================
// Always escape:
// & -> \\&
// % -> \\%
// $ -> \\$
// # -> \\#
// _ -> \\_
// { -> \\{
// } -> \\}
// ~ -> \\textasciitilde
// ^ -> \\textasciicircum

// =====================
// URL RULES
// =====================
// Always use:
// \\href{https://url}{text}
// Never leave href empty.
// `;


//   // ================= PLACEHOLDER MODE =================
//   if (!userProfile || (!userProfile.fullName && !userProfile.rawText)) {
//     fullPrompt += `
// If no personal data is available,
// generate a clean professional TEMPLATE using placeholders like:
// [Full Name], [Email], [Experience], etc.
// `;
//   }

//   console.log("[AI Service] Generating resume:");
//   console.log("  - Has user profile:", !!userProfile);
//   console.log("  - Profile name:", userProfile?.fullName || "N/A");
//   console.log("  - Company requirements length:", companyRequirements?.length || 0);

//   const response = await invokeLLM(fullPrompt, { temperature: 0.3 });
//   let latex = response.content;

//   // Clean markdown code blocks if present
//   latex = latex.replace(/^```latex\s*/i, "").replace(/```\s*$/, "");
//   latex = latex.replace(/^```\s*/i, "").replace(/```\s*$/, "");
//   return latex.trim();
// }

// /**
//  * Edit existing LaTeX based on user instruction
//  */
// export async function editResume(
//   currentLatex: string,
//   instruction: string,
//   inlineContext?: string
// ): Promise<{ latex: string; summary: string }> {
//   let prompt = `${LATEX_SYSTEM}

// Current LaTeX Resume:
// ${currentLatex}

// User Instruction: "${instruction}"
// `;

//   if (inlineContext) {
//     prompt += `
// Additional Context from Uploaded Documents:
// ${inlineContext}

// Use the information above if relevant to the user's instruction.
// `;
//   }

//   prompt += `
// Modify the LaTeX to fulfill the user's request. Maintain the same template structure and custom commands.

// IMPORTANT: You MUST respond with valid JSON in this exact format:
// {
//   "latex": "the full updated LaTeX code here",
//   "summary": "A detailed explanation of what changes were made (e.g., 'Updated the work experience section to highlight Python skills and added two new projects related to machine learning')"
// }

// The summary should be descriptive and explain what was changed, not just "Changes applied".`;

//   const response = await invokeLLM(prompt, { temperature: 0.3 });
//   let text = response.content;

//   console.log("[AI Service] Raw edit response length:", text.length);

//   // Clean markdown code blocks
//   text = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
//   text = text.replace(/^```\s*/i, "").replace(/```\s*$/, "");

//   // Try to extract JSON from the response
//   let latex = currentLatex;
//   let summary = "";

//   try {
//     // First try: direct JSON parse
//     const data = JSON.parse(text);
//     latex = data.latex || currentLatex;
//     summary = data.summary || "";
//     console.log("[AI Service] JSON parsed successfully, summary:", summary);
//   } catch {
//     console.log("[AI Service] Direct JSON parse failed, trying regex extraction");

//     // Second try: extract using regex for summary
//     const summaryMatch = text.match(/"summary"\s*:\s*"([^"]+)"/);
//     if (summaryMatch) {
//       summary = summaryMatch[1];
//       console.log("[AI Service] Extracted summary via regex:", summary);
//     }

//     // Try to extract latex using regex
//     const latexMatch = text.match(/"latex"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"summary"|"\s*})/);
//     if (latexMatch) {
//       // Unescape the LaTeX content
//       latex = latexMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
//       console.log("[AI Service] Extracted latex via regex");
//     } else if (!summary) {
//       // If no JSON structure found at all, assume it's just LaTeX
//       latex = text.trim() || currentLatex;
//     }
//   }

//   // If we still don't have a summary, generate a basic one based on instruction
//   if (!summary) {
//     summary = `Made changes based on your request: "${instruction.substring(0, 100)}${instruction.length > 100 ? '...' : ''}"`;
//   }

//   return { latex, summary };
// }

// /**
//  * Generate HTML preview from LaTeX
//  */
// export async function generatePreview(latexCode: string): Promise<string> {
//   const prompt = `Convert this LaTeX resume to semantic HTML with inline CSS.
// Make it look like a professional resume on white A4 paper.
// Use professional fonts (system fonts like -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto).
// Match the dark green/blue color scheme from the LaTeX.
// Use proper spacing and maintain the same visual hierarchy.

// LATEX:
// ${latexCode.substring(0, 15000)}

// Return ONLY raw HTML, no markdown blocks.`;

//   const response = await invokeLLM(prompt, { temperature: 0.3 });
//   let html = response.content;
//   html = html.replace(/^```html\s*/i, "").replace(/```\s*$/, "");
//   return html.trim();
// }

import { UserProfile, formatProfileForAI } from "./user-profile";
import { invokeLLM } from "./llm-client";

/* =========================================================
   ULTRA-SAFE LATEX TEMPLATE
   - zero custom macros
   - zero fancy packages
   - only primitives
   - near 100% compile success with tectonic
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

  let prompt = `
${LATEX_SYSTEM}

Current LaTeX:
${currentLatex}

Instruction:
${instruction}
`;

  if (inlineContext) {
    prompt += `\nExtra context:\n${inlineContext}`;
  }

  prompt += `
Return STRICT JSON:
{
  "latex": "...full latex...",
  "summary": "what changed"
}
`;

  const res = await invokeLLM(prompt, { temperature: 0.2 });

  let text = res.content
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "");

  try {
    const parsed = JSON.parse(text);
    return {
      latex: parsed.latex || currentLatex,
      summary: parsed.summary || "Changes applied"
    };
  } catch {
    return {
      latex: currentLatex,
      summary: "No valid changes returned"
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

