"use client";

import { useEffect, useRef, useState } from "react";

type Props = { poster: string; src: string };

export default function WeldingVideo({ poster, src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) videoRef.current?.pause();
      else videoRef.current?.play().catch(() => setPlaying(false));
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return <div className="hero-media">
    <video ref={videoRef} className="hero-video" poster={poster} muted loop playsInline preload="metadata" aria-label="Video ilustrasi proses pengelasan" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
      <source src={src} type="video/mp4" />
    </video>
    <div className="hero-media-shade" />
    <button className="video-toggle" type="button" onClick={() => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) video.play().catch(() => setPlaying(false));
      else video.pause();
    }} aria-label={playing ? "Jeda video pengelasan" : "Putar video pengelasan"}>{playing ? "Ⅱ" : "▶"}<span>{playing ? "JEDA VIDEO" : reducedMotion ? "PUTAR VIDEO" : "PUTAR ULANG"}</span></button>
  </div>;
}
