import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";

export function AnimatedShinyTextDemo() {
    return (
        <div className="z-10 flex items-center justify-center">
            <div
                className={cn(
                    "group relative overflow-hidden rounded-full border border-white/10 bg-neutral-900 px-6 py-2 text-xs font-medium text-white transition-all ease-in-out duration-300 hover:cursor-pointer hover:bg-neutral-800 hover:border-white/20"
                )}
            >
                <AnimatedShinyText className="inline-flex items-center justify-center text-white transition ease-out bg-gradient-to-r from-transparent via-white via-50% to-transparent bg-clip-text animate-shiny-text">
                    <span className="relative z-10">✨ Try It Out Now</span>
                    <ArrowRight className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </AnimatedShinyText>
            </div>
        </div>
    );
}
