"use client";
import React from "react";
import { LinkPreview } from "@/components/ui/link-preview";

export function LinkPreviewSection() {
  return (
    <div className="flex justify-center items-center flex-col px-6 text-neutral-300">
      <p className="text-sm md:text-xl max-w-3xl mx-auto mb-2 text-center">
        <LinkPreview
          url="https://ui.aceternity.com"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#db2c21] to-[#ff6a00] hover:brightness-110 transition-all duration-300"
        >
          Api-x
        </LinkPreview>{" "} is an open-source designed to replace .api and .rest files a suite of powerful features. Whether you're a{" "}<LinkPreview
          url="https://tailwindcss.com"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#db2c21] to-[#ff6a00] hover:brightness-110 transition-all duration-300"
        >
          solo developer
        </LinkPreview>{" "}

        Think of it as your API you send requests, manage authentication, and debug like a pro—without breaking a sweat. No more switching between {" "}<LinkPreview
          url="https://framer.com/motion"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#db2c21] to-[#ff6a00] hover:brightness-110 transition-all duration-300"
        >
          tools
        </LinkPreview>{" "}, no more wrestling with endless environment variables, and definitely no more manually copying tokens from your console (we&apos;ve all been there).
      </p>
    </div>
  );
}
