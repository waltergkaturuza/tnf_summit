import Image from "next/image";
import type { ReactNode } from "react";

type WallpaperSurfaceProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

/** Full-width photo background with scrim — matches registration form section. */
export default function WallpaperSurface({
  children,
  className = "",
  contentClassName = "",
}: WallpaperSurfaceProps) {
  return (
    <section className={`wallpaper-surface relative overflow-hidden ${className}`.trim()}>
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
      <div className={`relative z-10 ${contentClassName}`.trim()}>{children}</div>
    </section>
  );
}
