"use client";

import MicrofinanceStatCard from "./MicrofinanceStatCard";

export default function MicrofinanceStatsGrid({ cards }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <MicrofinanceStatCard key={card.id} card={card} />
      ))}
    </div>
  );
}
