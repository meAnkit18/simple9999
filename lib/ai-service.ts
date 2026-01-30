import { UserProfile, formatProfileForAI } from "./user-profile";
import { invokeLLM } from "./llm-client";

// Professional LaTeX Resume Template
const LATEX_TEMPLATE = String.raw`
%=================================================
% Minimal Professional Resume Template
% Render / Docker / EC2 SAFE
% ZERO fancy packages
%=================================================

\documentclass[letterpaper,11pt]{article}

% ===== ONLY SAFE PACKAGES =====
\usepackage{xcolor}
\usepackage[hidelinks]{hyperref}
\usepackage{enumitem}
\usepackage[english]{babel}

%=================================================
% COLORS (same theme as Aman resume)
%=================================================
\definecolor{heading}{rgb}{0.06,0.27,0.22}
\definecolor{textgray}{rgb}{0.35,0.35,0.35}

%=================================================
% PAGE LAYOUT
%=================================================
\addtolength{\oddsidemargin}{-0.6in}
\addtolength{\textwidth}{1.2in}
\addtolength{\topmargin}{-0.7in}
\addtolength{\textheight}{1.4in}

\pagestyle{empty}
\raggedright
\urlstyle{same}

%=================================================
% SECTION STYLE (NO titlesec)
%=================================================
\makeatletter
\def\section{\@startsection{section}{1}{\z@}
  {2.5ex}
  {1ex}
  {\large\bfseries\color{heading}\scshape}}
\makeatother

\let\oldsection\section
\renewcommand{\section}[1]{%
  \oldsection{#1}
  \vspace{2pt}
  \hrule height 0.6pt
  \vspace{6pt}
}

%=================================================
% CUSTOM COMMANDS
%=================================================

\newcommand{\resumeItem}[1]{
  \item {\small #1}
}

\newcommand{\resumeSubheading}[4]{
\item
\begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
\textbf{#1} & #2 \\
\textit{#3} & \textit{#4} \\
\end{tabular*}
}

\newcommand{\resumeProject}[2]{
\item
\textbf{#1} \hfill #2
}

\newcommand{\resumeListStart}{
\begin{itemize}[leftmargin=0in,label={}]
}

\newcommand{\resumeListEnd}{
\end{itemize}
}

\newcommand{\resumeItemListStart}{
\begin{itemize}[leftmargin=0.2in]
}

\newcommand{\resumeItemListEnd}{
\end{itemize}
}

%=================================================
% DOCUMENT START
%=================================================
\begin{document}

%================ HEADER =================
\begin{center}
{\Huge \textbf{Your Name}}\\
City, State, Country\\
\small
Phone: +91-XXXXXXXXXX $|$
\href{mailto:you@email.com}{you@email.com} $|$
\href{https://linkedin.com/in/yourid}{LinkedIn} $|$
\href{https://github.com/yourid}{GitHub}
\end{center}

%================ EDUCATION =================
\section{Education}
\resumeListStart
\resumeSubheading
{University Name}{2020--2024}
{B.Tech Computer Science}{City}
\resumeListEnd

%================ EXPERIENCE =================
\section{Experience}
\resumeListStart

\resumeSubheading
{Software Developer — Company}{2024--Present}
{Role}{Location}
\resumeItemListStart
\resumeItem{Built scalable backend services using Java and MongoDB}
\resumeItem{Improved performance by 30\% using optimized algorithms}
\resumeItemListEnd

\resumeListEnd

%================ PROJECTS =================
\section{Projects}
\resumeListStart

\resumeProject
{\href{https://github.com/yourproject}{Project Name | React, Node, MongoDB}}{2024}
\resumeItemListStart
\resumeItem{Developed full-stack application with authentication}
\resumeItem{Deployed on cloud with CI/CD}
\resumeItemListEnd

\resumeListEnd

%================ SKILLS =================
\section{Technical Skills}
\begin{itemize}[leftmargin=0.15in,label={}]
\item \small{
\textbf{Languages:} Java, Python, C++ \\
\textbf{Frameworks:} React, Node, Express \\
\textbf{Tools:} Git, Docker, VS Code
}
\end{itemize}

%================ CERTIFICATIONS =================
\section{Certifications}
\small
• \href{https://link}{Course Name – Udemy} \\
• \href{https://link}{Another Certificate}

%================ EXTRACURRICULAR =================
\section{Extracurricular}
\resumeListStart
\resumeItemListStart
\resumeItem{Participated in hackathons and coding contests}
\resumeItem{Open-source contributor}
\resumeItemListEnd
\resumeListEnd

\end{document}


`;

const LATEX_SYSTEM = `You are an expert LaTeX resume builder. You MUST use the EXACT template structure provided.

IMPORTANT RULES:
1. Use the EXACT custom commands from the template: \\resumeSubheading, \\resumeItem, \\resumeProjectHeading, etc.
2. Keep the same color scheme and formatting (cvblue, darkcolor, etc.)
3. STRUCTURE: Use \\section{SECTION NAME} followed by \\resumeSubHeadingListStart ...
4. HELPFUL COMMANDS: Use \\href{url}{text} for links. 
5. NO ICONS/GRAPHICS: Do NOT use FontAwesome, tikz, svg, or images. Use text labels (e.g., "Phone:", "Email:", "GitHub:") or standard bullets ($\\bullet$).
6. Make it ATS-friendly and professional
7. Keep to ONE page if possible
8. Do NOT use markdown code blocks in output, just raw LaTeX.

CRITICAL SPACING RULES (TO PREVENT OVERLAPPING TEXT):
9. Respect the template's spacing. \\vspace{-7pt} is standard for headings in this template using the custom commands.
10. Do not add excessive negative vspace manually unless necessary.
11. OPTIMIZE FOR ROBUSTNESS: Avoid packages like 'enumitem', 'titlesec', 'fontawesome5', 'multicol', 'tikz'. Use standard tabular environments and basic formatting.
`;

/**
 * Generate a tailored LaTeX resume based on:
 * 1. User's profile data (from their uploaded documents)
 * 2. Company/job requirements (what the user is asking for)
 */
export async function generateResume(
  companyRequirements: string,
  userProfile: UserProfile | null,
  rawContext?: string
): Promise<string> {
  let fullPrompt = `${LATEX_SYSTEM}

TEMPLATE STRUCTURE TO USE:
${LATEX_TEMPLATE}

`;

  // First: User's profile data
  if (userProfile && (userProfile.fullName || userProfile.rawText)) {
    const formattedProfile = formatProfileForAI(userProfile);

    fullPrompt += `===== USER'S PERSONAL PROFILE =====
The following is the user's REAL professional data extracted from their uploaded documents 
(LinkedIn PDF, certificates, old resumes, etc). You MUST use this information:

${formattedProfile}
`;

    // If we have raw text and the formatted profile seems incomplete, add it
    if (userProfile.rawText && formattedProfile.length < 500) {
      fullPrompt += `
Additional Raw Data from Documents:
${userProfile.rawText.substring(0, 8000)}
`;
    }

    fullPrompt += `===== END USER PROFILE =====

`;
  } else if (rawContext && rawContext.trim().length > 50) {
    // Fallback to raw context if no structured profile
    fullPrompt += `===== USER'S DOCUMENT DATA =====
${rawContext.substring(0, 10000)}
===== END USER DATA =====

`;
  }

  // Second: Company/job requirements
  fullPrompt += `===== COMPANY/JOB REQUIREMENTS =====
The user wants a resume tailored for:
"${companyRequirements}"

Based on the company requirements, you should:
1. Highlight relevant skills and experience from the user's profile
2. Adjust the professional summary to match the target role
3. Emphasize projects and achievements that align with what the company wants
4. Use keywords and terminology relevant to the target position
===== END REQUIREMENTS =====

`;

  // Final instructions with template examples
  fullPrompt += `GENERATE THE RESUME NOW. Here's how each section should look:

HEADING SECTION EXAMPLE:
\\begin{center}
    {\\Huge \\scshape [Full Name]} \\\\ \\vspace{1pt}
    [Location] \\\\ \\vspace{1pt}
    \\small \\href{tel:1234567890}{\\underline{[Phone]}} $|$ \\href{mailto:email@example.com}{\\underline{[Email]}} $|$ 
    \\href{https://linkedin.com/in/user}{\\underline{LinkedIn}} $|$
    \\href{https://github.com/user}{\\underline{Github}}
\\end{center}
\\vspace{0.5mm}

EDUCATION SECTION EXAMPLE:
\\section{EDUCATION}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {[University Name]}{[Year Range]}
      {[Degree] - \\textbf{CGPA} - \\textbf{[GPA]}}{[Location]}
  \\resumeSubHeadingListEnd

EXPERIENCE SECTION EXAMPLE:
\\section{EXPERIENCE}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {[Job Title] at [Company]}{[Date Range]} 
      {\\underline{Role - [Role Name]}}{[Location]}
      \\resumeItemListStart
        \\resumeItem{[Achievement/responsibility with metrics if possible]}
        \\resumeItem{[Another achievement highlighting \\textbf{key technologies}]}
      \\resumeItemListEnd  
  \\resumeSubHeadingListEnd

PROJECTS SECTION EXAMPLE:
\\section{PROJECTS}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart
     \\resumeProjectHeading
          {\\href{https://project-url.com}{\\textbf{\\large{\\underline{[Project Name]}}}} $|$ \\large{\\underline{[Tech Stack]}}}{[Year]}\\\\
          \\resumeItemListStart
            \\resumeItem {[Description of what you built]}
            \\resumeItem{[Impact/features]}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

SKILLS SECTION EXAMPLE:
\\section{TECHNICAL SKILLS}
 \\begin{list}{}{\\setlength{\\leftmargin}{0.15in}\\setlength{\\labelwidth}{0pt}}
    \\small{\\item{
     \\textbf{\\normalsize{Languages:}}{  \\normalsize{[Languages]}} \\\\
     \\textbf{\\normalsize{Technologies/Frameworks:}}{  \\normalsize{[Frameworks]}} \\\\
     \\textbf{\\normalsize{Developer Tools:}}{  \\normalsize{[Tools]}} \\\\
    }}
 \\end{list}
 \\vspace{-3pt}

CERTIFICATIONS SECTION EXAMPLE:
\\section{CERTIFICATIONS}
$\\sbullet \\hspace{0.1cm}$ {\\href{https://cert-url.com}{[Certification Name]}} \\hspace{2.59cm}\\\\
$\\sbullet \\hspace{0.1cm}$ {\\href{https://cert-url.com}{[Another Certification]}} \\hspace{1.6cm}\\\\

EXTRACURRICULAR SECTION EXAMPLE:
\\section{EXTRACURRICULAR}
    \\resumeSubHeadingListStart
            \\resumeItemListStart
                \\resumeItem{[Activity/Achievement]}
                \\resumeItem{[Another activity]}
            \\resumeItemListEnd
    \\resumeSubHeadingListEnd

`;

  if (userProfile && (userProfile.fullName || userProfile.rawText)) {
    fullPrompt += `CRITICAL INSTRUCTIONS:
1. Use the ACTUAL name, email, phone, and contact info from the user's profile. DO NOT make up fake data.
2. Include REAL work experience, education, and skills from their profile.
3. Tailor the content to match the company requirements, but use only REAL information.
4. If some information is missing from their profile, omit that section entirely rather than inventing fake data.
5. If there's no GitHub/LinkedIn URL, don't include those links.
6. DO NOT use \\includegraphics for any external images.
7. Output ONLY raw LaTeX code, no markdown code blocks.
8. URL RULES: Always use https:// protocol for all URLs (e.g., \\href{https://...}{...}).
9. ESCAPE SPECIAL CHARACTERS: You MUST escape the following characters in text content to prevent compilation errors:
   - & -> \\&
   - % -> \\%
   - $ -> \\$
   - # -> \\#
   - _ -> \\_
   - { -> \\{
   - } -> \\}
   - ~ -> \\textasciitilde
   - ^ -> \\textasciicircum
10. HREF SYNTAX: Always use \\href{url}{text}. Never use empty brackets like \\href{}[text] or \\href{url}[].
`;
  } else {
    fullPrompt += `NOTE: No personal documents were found. Generate a professional TEMPLATE resume 
with placeholder content like [Your Name], [Your Email], [Your Experience Here], etc.
The user will fill in their real information later.

Output ONLY raw LaTeX code, no markdown code blocks.
`;
  }

  console.log("[AI Service] Generating resume:");
  console.log("  - Has user profile:", !!userProfile);
  console.log("  - Profile name:", userProfile?.fullName || "N/A");
  console.log("  - Company requirements length:", companyRequirements?.length || 0);

  const response = await invokeLLM(fullPrompt, { temperature: 0.3 });
  let latex = response.content;

  // Clean markdown code blocks if present
  latex = latex.replace(/^```latex\s*/i, "").replace(/```\s*$/, "");
  latex = latex.replace(/^```\s*/i, "").replace(/```\s*$/, "");
  return latex.trim();
}

/**
 * Edit existing LaTeX based on user instruction
 */
export async function editResume(
  currentLatex: string,
  instruction: string,
  inlineContext?: string
): Promise<{ latex: string; summary: string }> {
  let prompt = `${LATEX_SYSTEM}

Current LaTeX Resume:
${currentLatex}

User Instruction: "${instruction}"
`;

  if (inlineContext) {
    prompt += `
Additional Context from Uploaded Documents:
${inlineContext}

Use the information above if relevant to the user's instruction.
`;
  }

  prompt += `
Modify the LaTeX to fulfill the user's request. Maintain the same template structure and custom commands.

IMPORTANT: You MUST respond with valid JSON in this exact format:
{
  "latex": "the full updated LaTeX code here",
  "summary": "A detailed explanation of what changes were made (e.g., 'Updated the work experience section to highlight Python skills and added two new projects related to machine learning')"
}

The summary should be descriptive and explain what was changed, not just "Changes applied".`;

  const response = await invokeLLM(prompt, { temperature: 0.3 });
  let text = response.content;

  console.log("[AI Service] Raw edit response length:", text.length);

  // Clean markdown code blocks
  text = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
  text = text.replace(/^```\s*/i, "").replace(/```\s*$/, "");

  // Try to extract JSON from the response
  let latex = currentLatex;
  let summary = "";

  try {
    // First try: direct JSON parse
    const data = JSON.parse(text);
    latex = data.latex || currentLatex;
    summary = data.summary || "";
    console.log("[AI Service] JSON parsed successfully, summary:", summary);
  } catch {
    console.log("[AI Service] Direct JSON parse failed, trying regex extraction");

    // Second try: extract using regex for summary
    const summaryMatch = text.match(/"summary"\s*:\s*"([^"]+)"/);
    if (summaryMatch) {
      summary = summaryMatch[1];
      console.log("[AI Service] Extracted summary via regex:", summary);
    }

    // Try to extract latex using regex
    const latexMatch = text.match(/"latex"\s*:\s*"([\s\S]*?)(?:"\s*,\s*"summary"|"\s*})/);
    if (latexMatch) {
      // Unescape the LaTeX content
      latex = latexMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      console.log("[AI Service] Extracted latex via regex");
    } else if (!summary) {
      // If no JSON structure found at all, assume it's just LaTeX
      latex = text.trim() || currentLatex;
    }
  }

  // If we still don't have a summary, generate a basic one based on instruction
  if (!summary) {
    summary = `Made changes based on your request: "${instruction.substring(0, 100)}${instruction.length > 100 ? '...' : ''}"`;
  }

  return { latex, summary };
}

/**
 * Generate HTML preview from LaTeX
 */
export async function generatePreview(latexCode: string): Promise<string> {
  const prompt = `Convert this LaTeX resume to semantic HTML with inline CSS.
Make it look like a professional resume on white A4 paper.
Use professional fonts (system fonts like -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto).
Match the dark green/blue color scheme from the LaTeX.
Use proper spacing and maintain the same visual hierarchy.

LATEX:
${latexCode.substring(0, 15000)}

Return ONLY raw HTML, no markdown blocks.`;

  const response = await invokeLLM(prompt, { temperature: 0.3 });
  let html = response.content;
  html = html.replace(/^```html\s*/i, "").replace(/```\s*$/, "");
  return html.trim();
}
