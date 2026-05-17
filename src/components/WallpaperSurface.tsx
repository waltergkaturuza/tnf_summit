import Image from "next/image";
import type { ReactNode } from "react";

type WallpaperSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Stretch background to fill remaining viewport (use with flex min-h-screen page shell). */
  fillViewport?: boolean;
};

/** Full-width photo background with scrim — matches registration form section. */
export default function WallpaperSurface({
  children,
  className = "",
  contentClassName = "",
  fillViewport = false,
}: WallpaperSurfaceProps) {
  return (
    <section
      className={[
        "wallpaper-surface relative overflow-hidden",
        fillViewport ? "flex-1 flex flex-col min-h-0" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/about_wallpaper.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover object-center"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[#0A1628]/85" />
      <div
        className={[
          "relative z-10",
          fillViewport ? "flex-1 flex flex-col min-h-0" : "",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </section>
  );
}
