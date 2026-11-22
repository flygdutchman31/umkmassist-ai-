"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./glass-shatter.css";

const MAX_BURSTS = 4;
const SHARD_COUNT = 11;
const BURST_LIFETIME = 820;
const SHARD_SHAPES = [
  "polygon(50% 0, 100% 100%, 0 72%)",
  "polygon(12% 0, 100% 34%, 72% 100%, 0 68%)",
  "polygon(50% 0, 100% 50%, 34% 100%, 0 32%)",
  "polygon(0 18%, 78% 0, 100% 82%, 34% 100%)",
];

type Burst = {
  id: number;
  x: number;
  y: number;
  shards: Array<{
    id: number;
    shape: string;
    color: string;
    size: number;
    x: number;
    y: number;
    rotation: number;
    delay: number;
    duration: number;
  }>;
};

const GLASS_COLORS = ["#ffffff", "#e4f4f7", "#c8e8ee", "#f3fbfc"];

export default function GlassShatter() {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Map<number, ReturnType<typeof setTimeout>>();
    let activeBursts: Burst[] = [];

    const syncBursts = () => setBursts(activeBursts);
    const clearBursts = () => {
      timers.forEach(clearTimeout);
      timers.clear();
      activeBursts = [];
      syncBursts();
    };

    const onMotionPreferenceChange = () => {
      if (motionPreference.matches) clearBursts();
    };

    const onClick = (event: MouseEvent) => {
      if (motionPreference.matches) return;

      const target = event.target instanceof Element ? event.target : null;
      const rect = target?.getBoundingClientRect();
      const keyboardActivation = event.detail === 0;
      const x = keyboardActivation && rect
        ? rect.left + rect.width / 2
        : event.clientX || (keyboardActivation ? window.innerWidth / 2 : 0);
      const y = keyboardActivation && rect
        ? rect.top + rect.height / 2
        : event.clientY || (keyboardActivation ? window.innerHeight / 2 : 0);

      const id = nextId.current++;
      const burst: Burst = {
        id,
        x,
        y,
        shards: Array.from({ length: SHARD_COUNT }, (_, index) => {
          const angle = (Math.PI * 2 * index) / SHARD_COUNT + (Math.random() - 0.5) * 0.5;
          const distance = 38 + Math.random() * 70;

          return {
            id: index,
            shape: SHARD_SHAPES[Math.floor(Math.random() * SHARD_SHAPES.length)],
            color: GLASS_COLORS[Math.floor(Math.random() * GLASS_COLORS.length)],
            size: 15 + Math.random() * 24,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            rotation: (Math.random() - 0.5) * 220,
            delay: Math.random() * 65,
            duration: 560 + Math.random() * 240,
          };
        }),
      };

      while (activeBursts.length >= MAX_BURSTS) {
        const oldest = activeBursts.shift();
        if (oldest) {
          const timer = timers.get(oldest.id);
          if (timer) clearTimeout(timer);
          timers.delete(oldest.id);
        }
      }

      activeBursts = [...activeBursts, burst];
      syncBursts();
      timers.set(id, setTimeout(() => {
        timers.delete(id);
        activeBursts = activeBursts.filter((item) => item.id !== id);
        syncBursts();
      }, BURST_LIFETIME));
    };

    document.addEventListener("click", onClick, true);
    motionPreference.addEventListener("change", onMotionPreferenceChange);
    document.documentElement.dataset.glassEffectReady = "true";

    return () => {
      document.removeEventListener("click", onClick, true);
      motionPreference.removeEventListener("change", onMotionPreferenceChange);
      timers.forEach(clearTimeout);
      timers.clear();
      delete document.documentElement.dataset.glassEffectReady;
    };
  }, []);

  return (
    <div className="glass-shatter-layer" aria-hidden="true">
      {bursts.map((burst) => (
        <span
          className="glass-shatter-burst"
          key={burst.id}
          style={{ left: burst.x, top: burst.y } as CSSProperties}
        >
          {burst.shards.map((shard) => (
            <span
              className="glass-shard"
              key={shard.id}
              style={{
                "--shard-size": `${shard.size}px`,
                "--shard-x": `${shard.x}px`,
                "--shard-y": `${shard.y}px`,
                "--shard-rotation": `${shard.rotation}deg`,
                "--shard-delay": `${shard.delay}ms`,
                "--shard-duration": `${shard.duration}ms`,
                "--shard-shape": shard.shape,
                "--shard-color": shard.color,
              } as CSSProperties}
            />
          ))}
        </span>
      ))}
    </div>
  );
}
