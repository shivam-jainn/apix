import { Bento } from "./bento";

export function FeatureSection() {
    return (
        <div
            className="bg-black px-48 py-32 flex flex-col gap-4 relative"
            style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "8px 8px",
            }}
        >
            {/* Radial gradient overlay for the faded effect */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <h1 className="text-center text-5xl font-bold text-white mb-20 relative z-10">
                Why Choose APIX?
            </h1>
            <Bento />
        </div>
    );
}
