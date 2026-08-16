import { StickyNav } from "@/components/layout/sticky-nav";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { About } from "@/components/sections/about";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <StickyNav />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
