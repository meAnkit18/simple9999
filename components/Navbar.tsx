import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
    return (
        <div className="w-full h-16 flex justify-between items-center px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Simple9999.com</h1>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                    U
                </div>
            </div>
        </div>
    )
}