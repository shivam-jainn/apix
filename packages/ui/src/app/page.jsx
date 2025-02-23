"use client"
import Navbar from "@/components/hero-section/navbar";
import HeroSection from "@/components/hero-section/hero-section";
import Footer from "@/components/hero-section/footer";
import { Testimonial } from "@/components/testimonial/testimonial";
import { FeatureSection } from '@/components/feature-section/feature-section'

export default function Page() {
  return (
    <>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #0d0c0c;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <div className="min-h-screen bg-[#0d0c0c]">
        <Navbar />
        <HeroSection />
        <FeatureSection />
        <Testimonial />
        <Footer />
      </div>
    </>
  );
}
