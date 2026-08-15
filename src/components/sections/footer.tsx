import { siteConfig } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";

export function Footer() {
  return (
    <SectionWrapper tone="inverse" className="py-8">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
        <p className="font-display text-lg font-bold text-ink-inverse">{siteConfig.name}</p>
        <div className="flex flex-col gap-1 text-sm text-ink-inverse/70 sm:text-right">
          <a href={`mailto:${siteConfig.email}`} className="hover:text-ink-inverse">
            {siteConfig.email}
          </a>
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
