import { ChatGroq } from "@langchain/groq";
import { HfInference } from "@huggingface/inference";

// Initialize Groq Client
const groqModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
});

// Initialize Hugging Face Client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Fallback model for Hugging Face
const HF_FALLBACK_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

interface LLMResponse {
    content: string;
}

/**
 * Invoke LLM with fallback mechanism
 * Tries Groq first, falls back to Hugging Face on rate limit (429)
 */
export async function invokeLLM(
    prompt: string,
    config?: { temperature?: number }
): Promise<LLMResponse> {
    try {
        // Try Groq first
        // We create a new instance if config is provided to override defaults, 
        // otherwise use the static instance to save resources if possible, 
        // but LangChain objects are lightweight enough to re-instantiate if needed for config.
        // For simplicity and config support, let's just use the main instance 
        // but note that ChatGroq doesn't easily support per-call temperature override 
        // in the invoke method options in all versions. 
        // So we might need to instantiate a new one if temperature is critical, 
        // or just accept the default. 
        // Given the existing code uses specific temperatures (0.3 and 0.2), 
        // let's respect that.

        const currentGroq = config?.temperature !== undefined
            ? new ChatGroq({
                apiKey: process.env.GROQ_API_KEY!,
                model: "llama-3.3-70b-versatile",
                temperature: config.temperature,
            })
            : groqModel;

        const response = await currentGroq.invoke(prompt);
        return { content: response.content as string };

    } catch (error: any) {
        // Check for rate limit error
        // Groq API usually returns 429 status code
        const isRateLimit =
            error?.status === 429 ||
            error?.response?.status === 429 ||
            error?.message?.includes("429") ||
            error?.message?.toLowerCase().includes("rate limit");

        if (isRateLimit) {
            console.warn("⚠️ Groq Rate Limit Hit! Falling back to Hugging Face...");

            try {
                const result = await hf.chatCompletion({
                    model: HF_FALLBACK_MODEL,
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 2048,
                    temperature: config?.temperature ?? 0.3,
                });

                return { content: result.choices[0].message.content || "" };
            } catch (hfError) {
                console.error("❌ Hugging Face Fallback Failed:", hfError);
                throw hfError; // If fallback fails, throw the error
            }
        }

        // If it's not a rate limit error, rethrow it
        throw error;
    }
}
