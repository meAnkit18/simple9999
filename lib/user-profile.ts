import File from "@/models/File";
import User from "@/models/User";
import mongoose from "mongoose";
import { invokeLLM } from "./llm-client";

export interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    summary: string;
    skills: string[];
    experience: {
        title: string;
        company: string;
        duration: string;
        description: string;
    }[];
    education: {
        degree: string;
        institution: string;
        year: string;
    }[];
    certifications: string[];
    projects: {
        name: string;
        description: string;
        technologies: string[];
    }[];
    achievements: string[];
    rawText: string;
}

/**
 * Get ALL document text for a user (not similarity-based, just all their data)
 */
export async function getAllUserDocumentText(userId: string): Promise<string> {
    console.log("[User Profile] Getting all documents for userId:", userId);

    const files = await File.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .lean();

    console.log("[User Profile] Found", files?.length || 0, "documents");

    if (!files || files.length === 0) {
        return "";
    }

    // Combine all text from all documents
    const allText = files
        .map((file: { chunks?: { text: string }[]; originalName?: string }) => {
            if (!file.chunks || file.chunks.length === 0) return "";
            const docText = file.chunks.map((c) => c.text).join("\n");
            return `[Document: ${file.originalName || "Unknown"}]\n${docText}`;
        })
        .filter(Boolean)
        .join("\n\n---\n\n");

    console.log("[User Profile] Total text length:", allText?.length || 0);
    return allText;
}

/**
 * Extract structured user profile from all their uploaded documents
 */
export async function extractUserProfile(userId: string): Promise<UserProfile | null> {
    const rawText = await getAllUserDocumentText(userId);

    if (!rawText || rawText.trim().length < 50) {
        console.log("[User Profile] Not enough document data to extract profile");
        return null;
    }

    console.log("[User Profile] Extracting structured profile from documents...");

    const prompt = `Extract a structured professional profile from the following document content.
This content comes from a user's uploaded documents (LinkedIn PDF, certificates, resume, etc).

=== DOCUMENT CONTENT ===
${rawText.substring(0, 20000)}
=== END CONTENT ===

Extract and return a JSON object with the following structure. If any field is not found, use empty string or empty array:
{
    "fullName": "Person's full name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, Country",
    "linkedin": "LinkedIn URL if present",
    "summary": "Professional summary/about section",
    "skills": ["skill1", "skill2", ...],
    "experience": [
        {
            "title": "Job Title",
            "company": "Company Name",
            "duration": "Start - End",
            "description": "Key responsibilities and achievements"
        }
    ],
    "education": [
        {
            "degree": "Degree Name",
            "institution": "University/School Name",
            "year": "Graduation Year"
        }
    ],
    "certifications": ["Certification 1", "Certification 2"],
    "projects": [
        {
            "name": "Project Name",
            "description": "Brief description",
            "technologies": ["tech1", "tech2"]
        }
    ],
    "achievements": ["Achievement 1", "Achievement 2"]
}

Return ONLY valid JSON, no markdown.`;

    try {
        const response = await invokeLLM(prompt, { temperature: 0.2 });
        let text = response.content;

        // Robust JSON extraction
        try {
            // Find the first outer brace and last outer brace
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');

            if (start !== -1 && end !== -1 && end > start) {
                const jsonStr = text.substring(start, end + 1);
                const profile = JSON.parse(jsonStr) as UserProfile;
                profile.rawText = rawText;
                console.log("[User Profile] Successfully extracted profile for:", profile.fullName);
                return profile;
            } else {
                // Fallback for when no JSON object is found, though unlikely given prompt
                console.warn("[User Profile] No JSON object found in LLM response");
                throw new Error("No JSON found");
            }
        } catch (parseError) {
            console.error("[User Profile] JSON parse error:", parseError);
            console.log("[User Profile] Raw content that failed to parse:", text);
            throw parseError;
        }
    } catch (err) {
        console.error("[User Profile] Failed to extract structured profile:", err);
        // Return a basic profile with just raw text
        return {
            fullName: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            summary: "",
            skills: [],
            experience: [],
            education: [],
            certifications: [],
            projects: [],
            achievements: [],
            rawText,
        };
    }
}

/**
 * Extract and save user profile to database
 */
export async function updateUserProfile(userId: string): Promise<void> {
    try {
        const profile = await extractUserProfile(userId);

        // Always update, even if null (to clear old data if all files deleted)
        await User.findByIdAndUpdate(userId, {
            profileData: profile,
            hasNewUploads: false
        });

        console.log("[User Profile] Database updated for user:", userId);
    } catch (err) {
        console.error("[User Profile] Failed to update user profile in DB:", err);
    }
}

/**
 * Format user profile as context for resume generation
 */
export function formatProfileForAI(profile: UserProfile): string {
    let context = "";

    if (profile.fullName) context += `Name: ${profile.fullName}\n`;
    if (profile.email) context += `Email: ${profile.email}\n`;
    if (profile.phone) context += `Phone: ${profile.phone}\n`;
    if (profile.location) context += `Location: ${profile.location}\n`;
    if (profile.linkedin) context += `LinkedIn: ${profile.linkedin}\n`;

    if (profile.summary) {
        context += `\nProfessional Summary:\n${profile.summary}\n`;
    }

    if (profile.skills && profile.skills.length > 0) {
        context += `\nSkills: ${profile.skills.join(", ")}\n`;
    }

    if (profile.experience && profile.experience.length > 0) {
        context += `\nWork Experience:\n`;
        profile.experience.forEach((exp) => {
            context += `- ${exp.title} at ${exp.company} (${exp.duration})\n`;
            if (exp.description) context += `  ${exp.description}\n`;
        });
    }

    if (profile.education && profile.education.length > 0) {
        context += `\nEducation:\n`;
        profile.education.forEach((edu) => {
            context += `- ${edu.degree} from ${edu.institution} (${edu.year})\n`;
        });
    }

    if (profile.certifications && profile.certifications.length > 0) {
        context += `\nCertifications: ${profile.certifications.join(", ")}\n`;
    }

    if (profile.projects && profile.projects.length > 0) {
        context += `\nProjects:\n`;
        profile.projects.forEach((proj) => {
            context += `- ${proj.name}: ${proj.description}`;
            if (proj.technologies.length > 0) {
                context += ` [${proj.technologies.join(", ")}]`;
            }
            context += "\n";
        });
    }

    if (profile.achievements && profile.achievements.length > 0) {
        context += `\nAchievements:\n`;
        profile.achievements.forEach((a) => {
            context += `- ${a}\n`;
        });
    }

    return context;
}
