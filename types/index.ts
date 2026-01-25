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
    CODING = "llama-3.3-70b-versatile",
    FAST = "llama-3.3-70b-versatile",
}
