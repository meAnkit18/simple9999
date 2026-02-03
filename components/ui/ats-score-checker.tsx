"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, AlertTriangle, ChevronRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { ATSScoreGauge } from "./ats-score-gauge";

interface AtsResult {
    score: number;
    strengths: string[];
    missingKeywords: string[];
    suggestions: string[];
}

export function AtsScoreChecker() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AtsResult | null>(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are supported");
                return;
            }
            setFile(selectedFile);
            setError("");
            setResult(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type !== "application/pdf") {
                setError("Only PDF files are supported");
                return;
            }
            setFile(droppedFile);
            setError("");
            setResult(null);
        }
    };

    const handleSubmit = async () => {
        if (!file || !jobDescription.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("jobDescription", jobDescription);

            const res = await fetch("/api/ats-check", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to analyze resume");
            }

            setResult(data.result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setJobDescription("");
        setResult(null);
        setError("");
    };

    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            {!result ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Inputs */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">1. Upload Resume</h3>
                            <div
                                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                  ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/50"}
                  ${file ? "bg-accent/30 border-primary/30" : ""}
                `}
                                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                />

                                {file ? (
                                    <div className="flex flex-col items-center animate-in zoom-in-95">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            className="mt-4 text-xs text-red-500 hover:text-red-600 font-medium"
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-3">
                                            <Upload className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <p className="font-medium">Click to upload or drag & drop</p>
                                        <p className="text-sm text-muted-foreground mt-1">PDF format only</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">2. Job Description</h3>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                                className="w-full h-48 p-4 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!file || !jobDescription.trim() || loading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing Match...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Analyze Compatibility
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right Column: Explainer */}
                    <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">How it works</h3>
                            <ul className="space-y-6">
                                {[
                                    { title: "Smart Parsing", desc: "We extract text from your PDF resume using advanced parsing." },
                                    { title: "Contextual Matching", desc: "Our AI compares your skills and experience against the job requirements." },
                                    { title: "Actionable Feedback", desc: "Get a score and a list of missing keywords to improve your chances." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{item.title}</h4>
                                            <p className="text-muted-foreground text-sm">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                /* Results View */
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Analysis Results</h2>
                        <button
                            onClick={reset}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            Start New Scan
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Score Card */}
                        {/* Score Card */}
                        <div className="bg-card border border-border rounded-2xl p-6 md:col-span-1 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                            <div className="flex-1 w-full flex items-center justify-center">
                                <ATSScoreGauge score={result.score} />
                            </div>
                            <div className="text-center mt-4 relative z-20 pb-2">
                                <p className={`font-medium text-lg ${result.score >= 80 ? "text-green-500" : result.score >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                                    {result.score >= 80 ? "Excellent Match" : result.score >= 60 ? "Good Potential" : "Needs Improvement"}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    Matched Strengths
                                </h4>
                                <ul className="space-y-2">
                                    {result.strengths.slice(0, 5).map((s, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                                {result.strengths.length === 0 && <p className="text-sm text-muted-foreground">No specific strengths detected.</p>}
                            </div>
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                    Missing Keywords
                                </h4>
                                <ul className="space-y-2">
                                    {result.missingKeywords.slice(0, 5).map((s, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                                {result.missingKeywords.length === 0 && <p className="text-sm text-muted-foreground">No critical keywords missing.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-card border border-border rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Improvement Suggestions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {result.suggestions.map((suggestion, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-accent/30 border border-border/50">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm leading-relaxed">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
