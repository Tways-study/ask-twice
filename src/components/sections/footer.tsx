import { Mail, Globe } from "lucide-react";

import { siteConfig, socialLinks } from "@/lib/constants";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { Logomark } from "@/components/layout/logomark";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

const links = [
  { href: `mailto:${siteConfig.email}`, label: "Email", icon: Mail, external: false },
  { href: socialLinks.facebook, label: "Facebook", icon: FacebookIcon, external: true },
  { href: socialLinks.portfolio, label: "Portfolio", icon: Globe, external: true },
];

export function Footer() {
  return (
    <SectionWrapper tone="inverse" className="py-8">
      <div className="flex flex-col items-center gap-6 border-t border-white/10 pt-8 text-center">
        <p className="flex items-center gap-2 font-display text-lg font-bold text-ink-inverse">
          <Logomark className="size-5 shrink-0" />
          {siteConfig.name}
        </p>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex size-11 items-center justify-center text-ink-inverse/70 transition-colors hover:text-ink-inverse"
            >
              <Icon className="size-5" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="text-sm text-ink-inverse/70">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </SectionWrapper>
  );
}
