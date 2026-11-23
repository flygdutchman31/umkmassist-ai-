"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type Props = { poster: string; src: string };

export default function WeldingVideo({ poster, src }: Props) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) videoRef.current?.pause();
      else videoRef.current?.play().catch(() => setPlaying(false));
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return <div className="hero-media">
    <video ref={videoRef} className="hero-video" poster={poster} muted loop playsInline preload="metadata" aria-label={language === "id" ? "Video ilustrasi proses pengelasan" : "Illustrative video of welding"} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
      <source src={src} type="video/mp4" />
    </video>
    <div className="hero-media-shade" />
    <button className="video-toggle" type="button" onClick={() => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) video.play().catch(() => setPlaying(false));
      else video.pause();
    }} aria-label={playing ? (language === "id" ? "Jeda video pengelasan" : "Pause welding video") : (language === "id" ? "Putar video pengelasan" : "Play welding video")}>{playing ? "Ⅱ" : "▶"}<span>{playing ? (language === "id" ? "JEDA VIDEO" : "PAUSE VIDEO") : (language === "id" ? "PUTAR VIDEO" : "PLAY VIDEO")}</span></button>
  </div>;
}
