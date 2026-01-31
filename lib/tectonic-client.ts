export async function compileLatex(latex: string): Promise<Buffer> {
    try {
        const response = await fetch("https://latexcompiler.onrender.com/compile", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: latex,
        });

        if (!response.ok) {
            const errorText = await response.text();
            const errorMessage = errorText.trim()
                ? errorText
                : `HTTP ${response.status} ${response.statusText}`;
            throw new Error(`Compilation failed: ${errorMessage}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error) {
        console.error("Tectonic compilation error:", error);
        throw error;
    }
}
