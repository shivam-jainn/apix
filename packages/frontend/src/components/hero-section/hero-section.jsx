import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Pixelify_Sans } from "next/font/google";
import { AnimatedShinyTextDemo } from "./shiny-button";
import { LinkPreviewSection } from "./link-preview-section";


// Import the font 
const pixelifySans = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
});

export default function HeroSection() {
    return (
        <>
            <div
                className="h-[100vh] w-full bg-black relative flex flex-col items-center justify-center"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            >
                {/* Radial gradient overlay for the faded effect */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

                {/* Apply the font ONLY to the Hero Text */}
                <p
                    className={`text-4xl mb-4 sm:text-9xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 ${pixelifySans.className}`}
                >
                    Api-X
                </p>

                <AnimatedShinyTextDemo />
            </div>

            <section className="container mx-auto w-full px-4 py-32 text-center bg-[#0d0c0c]">
                {/* Apply the font ONLY to the heading */}
                <h1 className={`text-5xl font-bold text-white mb-20`}>
                    API Testing, but with Superpowers!🚀
                </h1>
                <LinkPreviewSection />
                <div className="flex justify-center gap-4 mt-12">
                    <Button className="bg-neutral-800 text-white hover:bg-neutral-700">View Documentation</Button>
                    <Button className="bg-gradient-to-r from-[#db2c21] to-[#ff6a00] text-black font-semibold hover:brightness-110 transition-all duration-300">
                        View on GitHub <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </section>
        </>
    );
}
