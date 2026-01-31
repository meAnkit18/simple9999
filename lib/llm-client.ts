import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HfInference } from "@huggingface/inference";

interface LLMResponse {
    content: string;
}

// Fallback model for Hugging Face
const HF_FALLBACK_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

// Singleton instances (lazily initialized)
let _groqModel: ChatGroq | null = null;
let _googleModel: ChatGoogleGenerativeAI | null = null;
let _hfClient: HfInference | null = null;

function getGroqModel(temperature: number = 0.3) {
    // If we need a specific temperature different from default, return a new instance
    // OR if we don't have one yet.
    // Note: To support variable temperature efficiently without re-creating instances constantly,
    // we could just re-create. ChatGroq is lightweight.
    // But sticking to the pattern of "default or override":

    if (!_groqModel) {
        _groqModel = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY || "dummy_key", // Prevent build failure if key missing
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
        });
    }

    if (temperature !== 0.3) {
        return new ChatGroq({
            apiKey: process.env.GROQ_API_KEY || "dummy_key",
            model: "llama-3.3-70b-versatile",
            temperature: temperature,
        });
    }

    return _groqModel;
}

function getGoogleModel(temperature: number = 0.3) {
    if (!_googleModel) {
        _googleModel = new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY || "dummy_key",
            model: "gemini-2.5-flash-lite",
            temperature: 0.3,
        });
    }

    if (temperature !== 0.3) {
        return new ChatGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY || "dummy_key",
            model: "gemini-2.5-flash-lite",
            temperature: temperature,
        });
    }

    return _googleModel;
}

function getHfClient() {
    if (!_hfClient) {
        _hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
    }
    return _hfClient;
}

/**
 * Invoke LLM with fallback mechanism
 * Tries Groq first -> Fallback to Gemini -> Fallback to Hugging Face
 */
export async function invokeLLM(
    prompt: string,
    config?: { temperature?: number }
): Promise<LLMResponse> {
    const temperature = config?.temperature ?? 0.3;

    try {
        // 1. Try Groq
        const groq = getGroqModel(temperature);
        const response = await groq.invoke(prompt);
        return { content: response.content as string };

    } catch (groqError: any) {
        // Check for rate limit error (Groq 429)
        const isRateLimit =
            groqError?.status === 429 ||
            groqError?.response?.status === 429 ||
            groqError?.message?.includes("429") ||
            groqError?.message?.toLowerCase().includes("rate limit");

        if (isRateLimit) {
            console.warn("⚠️ Groq Rate Limit Hit! Falling back to Gemini...");

            try {
                // 2. Try Gemini
                const google = getGoogleModel(temperature);
                const response = await google.invoke(prompt);
                return { content: response.content as string };

            } catch (geminiError) {
                console.warn("⚠️ Gemini Failed or Rate Limited! Falling back to Hugging Face...", geminiError);
                // Proceed to Hugging Face fallback
            }
        } else {
            // For robustness (and since user specifically asked about rate limit), 
            // we will log but might rethrow or fall through.
            // Sticking to safer logic: if it's NOT a rate limit, we might want to fail loudly 
            // if it's a code error, but falling back for everything is also a strategy.
            // Let's stick to the previous conditional logic to be safe.
            if (!isRateLimit) {
                // Option: throw groqError; 
                // But let's log and fallthrough for maximum uptime? 
                // No, usually non-429 errors might be bad requests (context too long),
                // in which case fallback might also fail or be weird.
                // Let's rethrow non-429s as per previous "safety" logic.
                throw groqError;
            }
        }

        // 3. Fallback to Hugging Face
        try {
            console.log("🔄 Attempting Hugging Face fallback...");
            const hf = getHfClient();
            const result = await hf.chatCompletion({
                model: HF_FALLBACK_MODEL,
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 2048,
                temperature: temperature,
            });

            return { content: result.choices[0].message.content || "" };
        } catch (hfError) {
            console.error("❌ All Fallbacks Failed:", hfError);
            throw hfError;
        }
    }
}
