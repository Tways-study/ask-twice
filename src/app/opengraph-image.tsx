import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { services, siteConfig } from "@/lib/constants";

// Without this file there is no og:image at all, and scrapers fall back to
// guessing from the page — which picked the first portfolio thumbnail and
// advertised a client project as the brand.
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#ffffff";
const INK = "#1d1d1f";
const INK_SOFT = "#707070";
const RULE = "#d6d6d6";
const HIGHLIGHT = "#ffd75e";

const HEADLINE_PX = 104;

// Read at module scope per the Next 16 docs. Turbopack does not support
// `fetch(new URL(..., import.meta.url))` for local assets yet — it throws
// "not implemented" during prerender.
const display = await readFile(join(process.cwd(), "assets/inter-display-800.ttf"));
const body = await readFile(join(process.cwd(), "assets/inter-400.ttf"));

export default async function OpengraphImage() {
  const serviceLine = services
    .filter((service) => service.priceRange !== "Ask me")
    .slice(0, 4)
    .map((service) => service.name)
    .join("  ·  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          padding: "72px 80px",
          fontFamily: "InterDisplay",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>
          {siteConfig.name}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: HEADLINE_PX,
            fontWeight: 800,
            color: INK,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          <span>Schoolwork,</span>
          {/* The signature highlighter swipe in its final state. Painted as a
              background gradient rather than an absolutely-positioned bar:
              satori won't stretch `left`+`right` inside a shrink-wrapped flex
              parent, which collapsed the bar to the width of one glyph. */}
          <span
            style={{
              marginLeft: 26,
              paddingLeft: 10,
              paddingRight: 10,
              background: `linear-gradient(to top, ${HIGHLIGHT} 0%, ${HIGHLIGHT} 60%, transparent 60%)`,
            }}
          >
            handled.
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: "100%", height: 1, backgroundColor: RULE, marginBottom: 28 }} />
          <div style={{ display: "flex", fontFamily: "Inter", fontSize: 27, color: INK_SOFT }}>
            {serviceLine}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "InterDisplay", data: display, weight: 800, style: "normal" },
        { name: "Inter", data: body, weight: 400, style: "normal" },
      ],
    }
  );
}
