"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MenuIcon } from "lucide-react";

import { navLinks, siteConfig } from "@/lib/constants";
import { useActiveSection } from "@/lib/use-active-section";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/components/layout/container";

const SECTION_IDS = navLinks.map((link) => link.href.replace("#", ""));

// The condense reads as the page settling, not a threshold snap — height,
// wordmark size, border, background, and blur all ease continuously with
// scroll position over the first 120px, rather than toggling a class.
const CONDENSE_RANGE: number[] = [0, 120];

export function StickyNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const activeSection = useActiveSection(SECTION_IDS);

  const navHeight = useTransform(scrollY, CONDENSE_RANGE, [80, 64]);
  const wordmarkSize = useTransform(scrollY, CONDENSE_RANGE, [22, 18]);
  const bgAlpha = useTransform(scrollY, CONDENSE_RANGE, [0, 0.92]);
  const borderAlpha = useTransform(scrollY, CONDENSE_RANGE, [0, 1]);
  const blurPx = useTransform(scrollY, CONDENSE_RANGE, [0, 8]);

  const background = useMotionTemplate`rgba(250, 245, 235, ${bgAlpha})`;
  const borderColor = useMotionTemplate`rgba(229, 218, 199, ${borderAlpha})`;
  const backdropFilter = useMotionTemplate`blur(${blurPx}px)`;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setDrawerOpen(false);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 border-b"
      style={
        reduceMotion
          ? { background: "var(--paper)", borderColor: "var(--rule)" }
          : { background, borderColor, backdropFilter }
      }
    >
      <Container>
        <motion.div
          className="flex items-center justify-between"
          style={reduceMotion ? { height: 64 } : { height: navHeight }}
        >
          <a href="#" className="flex h-11 items-center">
            <motion.span
              className="font-display font-bold text-ink"
              style={reduceMotion ? { fontSize: 18 } : { fontSize: wordmarkSize }}
            >
              {siteConfig.name}
            </motion.span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative flex h-11 items-center text-base font-medium transition-colors ${
                    isActive ? "font-semibold text-pen" : "text-ink-soft hover:text-pen"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-x-0 bottom-1.5 h-0.5 rounded-full bg-pen"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
            <Button asChild size="default">
              <a href="#contact">Get started</a>
            </Button>
          </nav>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <MenuIcon className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <motion.nav
                className="flex flex-col gap-1 px-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } },
                }}
              >
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.replace("#", "");
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex min-h-11 items-center text-lg font-medium ${
                        isActive ? "font-semibold text-pen" : "text-ink"
                      }`}
                      variants={{
                        hidden: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : 12 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}
                <Button asChild size="default" className="mt-4">
                  <a href="#contact" onClick={() => setDrawerOpen(false)}>
                    Get started
                  </a>
                </Button>
              </motion.nav>
            </SheetContent>
          </Sheet>
        </motion.div>
      </Container>
    </motion.header>
  );
}

