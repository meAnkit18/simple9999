import { ChatGroq } from "@langchain/groq";
import { UserProfile, formatProfileForAI } from "./user-profile";

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
});

// Professional LaTeX Resume Template
const LATEX_TEMPLATE = `%-------------------------
% Resume in Latex
% Professional ATS-Friendly Template
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\usepackage{graphicx}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\RequirePackage{tikz}
\\RequirePackage{xcolor}
\\RequirePackage{fontawesome}
\\usepackage{tikz}
\\usetikzlibrary{svg.path}


\\definecolor{cvblue}{HTML}{0E5484}
\\definecolor{black}{HTML}{130810}
\\definecolor{darkcolor}{HTML}{0F4539}
\\definecolor{cvgreen}{HTML}{3BD80D}
\\definecolor{taggreen}{HTML}{00E278}
\\definecolor{SlateGrey}{HTML}{2E2E2E}
\\definecolor{LightGrey}{HTML}{666666}
\\colorlet{name}{black}
\\colorlet{tagline}{darkcolor}
\\colorlet{heading}{darkcolor}
\\colorlet{headingrule}{cvblue}
\\colorlet{accent}{darkcolor}
\\colorlet{emphasis}{SlateGrey}
\\colorlet{body}{LightGrey}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\classesList}[4]{
    \\item\\small{
        {#1 #2 #3 #4 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{\\large#1} & \\textbf{\\small #2} \\\\
      \\textit{\\large#3} & \\textit{\\small #4} \\\\
      
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}


\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}


\\newcommand\\sbullet[1][.5]{\\mathbin{\\vcenter{\\hbox{\\scalebox{#1}{$\\bullet$}}}}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING----------
{{HEADING_SECTION}}

%-----------EDUCATION-----------
{{EDUCATION_SECTION}}

%-----------EXPERIENCE-----------
{{EXPERIENCE_SECTION}}

%-----------PROJECTS-----------
{{PROJECTS_SECTION}}

%-----------PROGRAMMING SKILLS-----------
{{SKILLS_SECTION}}

%-----------CERTIFICATIONS---------------
{{CERTIFICATIONS_SECTION}}

%-----------EXTRACURRICULAR---------------
{{EXTRACURRICULAR_SECTION}}

\\end{document}
`;

const LATEX_SYSTEM = `You are an expert LaTeX resume builder. You MUST use the EXACT template structure provided.

IMPORTANT RULES:
1. Use the EXACT custom commands from the template: \\resumeSubheading, \\resumeItem, \\resumeProjectHeading, etc.
2. Keep the same color scheme and formatting
3. Use \\faPhone, \\faEnvelope, \\faLinkedinSquare, \\faGithub icons for contact info
4. Structure sections exactly as shown
5. Make it ATS-friendly and professional
6. Keep to ONE page if possible
7. DO NOT include image references like \\includegraphics for external images (codeforces.jpg, leetcode.png, etc.) - just use text links instead`;

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
    \\small \\href{tel:#}{ \\raisebox{-0.1\\height}\\faPhone\\ \\underline{[Phone]} ~} \\href{mailto:[email]}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{[Email]}} ~ 
    \\href{[LinkedIn URL]}{\\raisebox{-0.2\\height}\\faLinkedinSquare\\ \\underline{LinkedIn}}  ~
    \\href{[GitHub URL]}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{Github}}
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
        \\resumeItem{\\normalsize{[Achievement/responsibility with metrics if possible]}}
        \\resumeItem{\\normalsize{[Another achievement highlighting \\textbf{key technologies}]}}
      \\resumeItemListEnd  
  \\resumeSubHeadingListEnd
\\vspace{-12pt}

PROJECTS SECTION EXAMPLE:
\\section{PROJECTS}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart
     \\resumeProjectHeading
          {\\href{[URL]}{\\textbf{\\large{\\underline{[Project Name]}}} \\href{[URL]}{\\raisebox{-0.1\\height}\\faExternalLink }} $|$ \\large{\\underline{[Tech Stack]}}}{[Year]}\\\\
          \\resumeItemListStart
            \\resumeItem {\\normalsize{[Description of what you built]}}
            \\resumeItem{\\normalsize{[Impact/features]}}
          \\resumeItemListEnd 
          \\vspace{-13pt}
    \\resumeSubHeadingListEnd

SKILLS SECTION EXAMPLE:
\\section{TECHNICAL SKILLS}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{\\normalsize{Languages:}}{  \\normalsize{[Languages]}} \\\\
     \\textbf{\\normalsize{Technologies/Frameworks:}}{  \\normalsize{[Frameworks]}} \\\\
     \\textbf{\\normalsize{Developer Tools:}}{  \\normalsize{[Tools]}} \\\\
    }}
 \\end{itemize}
 \\vspace{-15pt}

CERTIFICATIONS SECTION EXAMPLE:
\\section{CERTIFICATIONS}
$\\sbullet[.75] \\hspace{0.1cm}$ {\\href{[URL]}{[Certification Name]}} \\hspace{2.59cm}\\\\
$\\sbullet[.75] \\hspace{0.1cm}$ {\\href{[URL]}{[Another Certification]}} \\hspace{1.6cm}\\\\

EXTRACURRICULAR SECTION EXAMPLE:
\\section{EXTRACURRICULAR}
    \\resumeSubHeadingListStart
            \\resumeItemListStart
                \\resumeItem{\\normalsize{[Activity/Achievement]}}
                \\resumeItem{\\normalsize{[Another activity]}}
            \\resumeItemListEnd
    \\resumeSubHeadingListEnd
\\vspace{-11pt}

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

    const response = await model.invoke(fullPrompt);
    let latex = response.content as string;

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
    instruction: string
): Promise<{ latex: string; summary: string }> {
    const prompt = `${LATEX_SYSTEM}

Current LaTeX Resume:
${currentLatex}

User Instruction: "${instruction}"

Modify the LaTeX to fulfill the user's request. Maintain the same template structure and custom commands.

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
Use professional fonts (system fonts like -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto).
Match the dark green/blue color scheme from the LaTeX.
Use proper spacing and maintain the same visual hierarchy.

LATEX:
${latexCode.substring(0, 15000)}

Return ONLY raw HTML, no markdown blocks.`;

    const response = await model.invoke(prompt);
    let html = response.content as string;
    html = html.replace(/^```html\s*/i, "").replace(/```\s*$/, "");
    return html.trim();
}
