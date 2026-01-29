"use client";

import { useState, useEffect } from "react";
import {
    X,
    Loader2,
    Plus,
    Trash2,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Sparkles,
    Save,
} from "lucide-react";

interface Experience {
    title: string;
    company: string;
    duration: string;
    description?: string;
}

interface Education {
    degree: string;
    institution: string;
    year: string;
}

interface EditableProfile {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    summary?: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
}

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: EditableProfile | null;
    onSave: (profile: EditableProfile) => Promise<void>;
}

export default function ProfileEditModal({
    isOpen,
    onClose,
    profile,
    onSave,
}: ProfileEditModalProps) {
    const [editedProfile, setEditedProfile] = useState<EditableProfile>({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        summary: "",
        skills: [],
        experience: [],
        education: [],
    });
    const [saving, setSaving] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [activeSection, setActiveSection] = useState<"basic" | "skills" | "experience" | "education">("basic");

    useEffect(() => {
        if (profile) {
            setEditedProfile({
                fullName: profile.fullName || "",
                email: profile.email || "",
                phone: profile.phone || "",
                location: profile.location || "",
                linkedin: profile.linkedin || "",
                summary: profile.summary || "",
                skills: profile.skills || [],
                experience: profile.experience || [],
                education: profile.education || [],
            });
        }
    }, [profile]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(editedProfile);
            onClose();
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
            setEditedProfile({
                ...editedProfile,
                skills: [...editedProfile.skills, newSkill.trim()],
            });
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setEditedProfile({
            ...editedProfile,
            skills: editedProfile.skills.filter((s) => s !== skillToRemove),
        });
    };

    const addExperience = () => {
        setEditedProfile({
            ...editedProfile,
            experience: [
                ...editedProfile.experience,
                { title: "", company: "", duration: "", description: "" },
            ],
        });
    };

    const updateExperience = (index: number, field: keyof Experience, value: string) => {
        const updated = [...editedProfile.experience];
        updated[index] = { ...updated[index], [field]: value };
        setEditedProfile({ ...editedProfile, experience: updated });
    };

    const removeExperience = (index: number) => {
        setEditedProfile({
            ...editedProfile,
            experience: editedProfile.experience.filter((_, i) => i !== index),
        });
    };

    const addEducation = () => {
        setEditedProfile({
            ...editedProfile,
            education: [...editedProfile.education, { degree: "", institution: "", year: "" }],
        });
    };

    const updateEducation = (index: number, field: keyof Education, value: string) => {
        const updated = [...editedProfile.education];
        updated[index] = { ...updated[index], [field]: value };
        setEditedProfile({ ...editedProfile, education: updated });
    };

    const removeEducation = (index: number) => {
        setEditedProfile({
            ...editedProfile,
            education: editedProfile.education.filter((_, i) => i !== index),
        });
    };

    const sections = [
        { id: "basic", label: "Basic Info", icon: User },
        { id: "skills", label: "Skills", icon: Sparkles },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
    ] as const;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-purple-500/5">
                    <div>
                        <h2 className="text-2xl font-bold">Edit Profile</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Update your professional information
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-2 p-4 border-b border-border bg-accent/30">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeSection === section.id
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <section.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{section.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
                    {/* Basic Info Section */}
                    {activeSection === "basic" && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editedProfile.fullName}
                                        onChange={(e) =>
                                            setEditedProfile({ ...editedProfile, fullName: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={editedProfile.email}
                                        onChange={(e) =>
                                            setEditedProfile({ ...editedProfile, email: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={editedProfile.phone}
                                        onChange={(e) =>
                                            setEditedProfile({ ...editedProfile, phone: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={editedProfile.location}
                                        onChange={(e) =>
                                            setEditedProfile({ ...editedProfile, location: e.target.value })
                                        }
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                        placeholder="San Francisco, CA"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Professional Summary</label>
                                <textarea
                                    value={editedProfile.summary || ""}
                                    onChange={(e) =>
                                        setEditedProfile({ ...editedProfile, summary: e.target.value })
                                    }
                                    rows={4}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                                    placeholder="A brief summary of your professional background..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Skills Section */}
                    {activeSection === "skills" && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="Add a skill (e.g., React, Project Management)"
                                />
                                <button
                                    onClick={addSkill}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {editedProfile.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="group flex items-center gap-2 px-3 py-1.5 bg-accent/50 border border-border rounded-full text-sm hover:border-red-500/50 transition-colors"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {editedProfile.skills.length === 0 && (
                                    <p className="text-muted-foreground text-sm py-8 w-full text-center">
                                        No skills added yet. Add your first skill above.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Experience Section */}
                    {activeSection === "experience" && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            {editedProfile.experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-accent/30 border border-border rounded-xl relative group"
                                >
                                    <button
                                        onClick={() => removeExperience(index)}
                                        className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(index, "title", e.target.value)}
                                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
                                            placeholder="Job Title"
                                        />
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
                                            placeholder="Company Name"
                                        />
                                        <input
                                            type="text"
                                            value={exp.duration}
                                            onChange={(e) => updateExperience(index, "duration", e.target.value)}
                                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 md:col-span-2"
                                            placeholder="Duration (e.g., Jan 2020 - Present)"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addExperience}
                                className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Experience
                            </button>
                        </div>
                    )}

                    {/* Education Section */}
                    {activeSection === "education" && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            {editedProfile.education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-accent/30 border border-border rounded-xl relative group"
                                >
                                    <button
                                        onClick={() => removeEducation(index)}
                                        className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
                                            placeholder="Degree"
                                        />
                                        <input
                                            type="text"
                                            value={edu.institution}
                                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
                                            placeholder="Institution"
                                        />
                                        <input
                                            type="text"
                                            value={edu.year}
                                            onChange={(e) => updateEducation(index, "year", e.target.value)}
                                            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
                                            placeholder="Year"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={addEducation}
                                className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Education
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-accent/30">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
