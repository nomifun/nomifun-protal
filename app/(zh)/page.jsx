import Hero from "@/components/sections/Hero";
import AgentComposer from "@/components/sections/AgentComposer";
import CompanionSection from "@/components/sections/CompanionSection";
import WorkLoop from "@/components/sections/WorkLoop";
import CreativeSection from "@/components/sections/CreativeSection";
import ExtensionSection from "@/components/sections/ExtensionSection";
import DeveloperSection from "@/components/sections/DeveloperSection";
import StorySection from "@/components/sections/StorySection";
import EcosystemSection from "@/components/sections/EcosystemSection";
import FaqSection from "@/components/sections/FaqSection";
import MotionPrelude from "@/components/sections/MotionPrelude";
import {
  MotionHighlights,
  MotionShowcase,
  MotionPrinciples,
} from "@/components/sections/MotionExtras";
export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <MotionHighlights />
      <MotionPrelude />
      <MotionShowcase />
      <AgentComposer />
      <CompanionSection />
      <WorkLoop />
      <CreativeSection />
      <ExtensionSection />
      <DeveloperSection />
      <StorySection />
      <EcosystemSection />
      <FaqSection />
      <MotionPrinciples />
    </main>
  );
}
