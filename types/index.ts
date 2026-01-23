// TypeScript types for ResuVibe

export interface User {
    id: string;
    email: string;
    name: string;
    profileData?: string; // Master resume/profile data
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Project {
    id: string;
    userId: string;
    name: string;
    latexCode: string;
    previewHtml: string;
    chatHistory: ChatMessage[];
    createdAt: number;
    lastModified: number;
}

export enum ModelType {
    CODING = "gemini-2.0-flash",
    FAST = "gemini-2.0-flash",
}
