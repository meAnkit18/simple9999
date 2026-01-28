import { Logo } from "./Logo";

export function Footer() {
    return (
        <footer className="bg-background pt-24 pb-12 px-6 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-24 md:mb-32 gap-12">
                    <div className="max-w-md">
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
                            Experience Simplicity
                        </h2>
                    </div>

                    <div className="flex gap-16 md:gap-32">
                        <div className="flex flex-col gap-4">
                            <h3 className="font-medium text-lg">Product</h3>
                            <ul className="flex flex-col gap-3 text-muted-foreground">
                                {/* <li><a href="#" className="hover:text-foreground transition-colors">Download</a></li> */}
                                <li><a href="#" className="hover:text-foreground transition-colors">Product</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Docs</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="font-medium text-lg">Resources</h3>
                            <ul className="flex flex-col gap-3 text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Use Cases</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Huge Text */}
                <div className="w-full flex justify-center mb-24 md:mb-32">
                    <div className="flex flex-col items-center gap-4">
                        <Logo className="h-24 w-24 md:h-32 md:w-32 text-foreground" />
                        <h1 className="text-[11vw] leading-none font-bold tracking-tighter text-foreground select-none">
                            Simple9999.com
                        </h1>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <Logo className="h-6 w-6" />
                        Simple9999.com
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="hover:text-foreground transition-colors">About Simple9999</a>
                        <a href="#" className="hover:text-foreground transition-colors">Products</a>
                        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
