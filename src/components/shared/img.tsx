"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImgProps {
  src: string;
  alt: string;
  ratio?: string; // "4/3", "1/1", "16/9", "3/4" ...
  className?: string; // div wrapper
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
}

/** Wrapper next/image dengan aspect-ratio konsisten & object-cover. */
export function Img({
  src,
  alt,
  ratio = "4/3",
  className,
  imgClassName,
  priority,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: ImgProps) {
  return (
    <div className={cn("relative overflow-hidden bg-stone-200 dark:bg-stone-800", className)} style={{ aspectRatio: ratio }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imgClassName)}
      />
    </div>
  );
}
