"use client";

import { useEffect, useRef } from "react";
import { HomePage as OriginalHomePage } from "./home-page-original";

const COLUMNS = [
  "/images/portfolio-column-1.jpg",
  "/images/portfolio-column-2.jpg",
  "/images/portfolio-column-3.jpg",
] as const;

function PortfolioOverride() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const host = root.querySelector('[aria-label="Contoh hasil kerja AlexPicture"]');
    if (!host) return;

    host.innerHTML = "";
    host.className = "relative h-[390px] overflow-hidden rounded-2xl border border-stone-700/60 bg-stone-950 shadow-2xl sm:h-[450px]";

    const topFade = document.createElement("div");
    topFade.className = "pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-stone-950 to-transparent";
    const bottomFade = document.createElement("div");
    bottomFade.className = "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-stone-950 to-transparent";
    host.append(topFade, bottomFade);

    const grid = document.createElement("div");
    grid.className = "grid h-full grid-cols-3 gap-2 p-2";
    host.appendChild(grid);

    COLUMNS.forEach((src, index) => {
      const column = document.createElement("div");
      column.className = "relative overflow-hidden rounded-xl";
      const track = document.createElement("div");
      track.className = "flex flex-col gap-2";
      track.style.willChange = "transform";
      track.style.animation = `${index % 2 === 0 ? "portfolio-down" : "portfolio-up"} ${12 + index * 2}s linear infinite`;

      const img = document.createElement("img");
      img.src = src;
      img.alt = "Portofolio AlexPicture";
      img.className = "block h-auto w-full max-w-none shrink-0";
      img.draggable = false;
      track.appendChild(img);
      column.appendChild(track);
      grid.appendChild(column);
    });

    const style = document.createElement("style");
    style.textContent = `
      @keyframes portfolio-down { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      @keyframes portfolio-up { from { transform: translateY(0); } to { transform: translateY(-50%); } }
    `;
    host.appendChild(style);
  }, []);

  return <div ref={rootRef}><OriginalHomePage /></div>;
}

export function HomePage() {
  return <PortfolioOverride />;
}
