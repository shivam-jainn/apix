"use client"
import { Button } from "@/components/ui/button";
import { Pixelify_Sans } from "next/font/google";
import { useEffect, useState } from "react";

const pixelifySans = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
});

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 containermx-auto px-12 py-4 flex items-center justify-between w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/20 backdrop-blur-sm border-b border-white/10' : 'bg-transparent'
            }`}>
            <div className="flex items-center gap-2">
                <p
                    className={`text-4xl mb-4 sm:text-3xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-r from-[#db2c21] to-[#ff6a00] ${pixelifySans.className}`}

                >
                    Api-X
                </p>
            </div>
            <div className="flex items-center gap-4">
                <a
                    href="https://linktr.ee/api_x"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="ghost" className="text-gray-400 hover:text-black">
                        Contact
                    </Button>
                </a>
                <Button variant="ghost" className="text-gray-400 hover:text-black">
                    Docs
                </Button>
                <Button className="bg-gradient-to-r from-[#db2c21] to-[#ff6a00] text-black font-semibold hover:brightness-110 transition-all duration-300">
                    Try Now
                </Button>

            </div>
        </nav>
    );
}
