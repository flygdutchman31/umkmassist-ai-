export default function ArrowIcon({ direction = "up-right" }: { direction?: "up-right" | "up" | "down" }) {
  const paths = {
    "up-right": "M4 12 12 4M5 4h7v7",
    up: "M8 13V3M3 8l5-5 5 5",
    down: "M8 3v10M3 8l5 5 5-5",
  };
  return <svg className="arrow-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={paths[direction]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" /></svg>;
}
