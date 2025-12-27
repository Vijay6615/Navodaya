"use client";

import { PUJAS } from "../pujasData";
import PujaCard from "./PujaCard";

export default function PujasPreview({ limit, data }) {
  // simple fallback – no animation logic
  const source = data ?? PUJAS;
  const list = limit ? source.slice(0, limit) : source;

  return (
    <div className="grid-responsive">
      {list.map((p) => (
        <PujaCard key={p.id} puja={p} />
      ))}
    </div>
  );
}
