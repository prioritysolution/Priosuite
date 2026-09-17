"use client";

import * as React from "react";

const data = [
  { label: "Demand Collected", value: 28, color: "#22c55e" },
  { label: "Collection Pending", value: 72, color: "#f472b6" },
];

const ticks = [0, 20, 40, 60, 80, 100];

export default function CollectionStatusChart() {
  const [hoveredIdx, setHoveredIdx] = React.useState(null);
  const containerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = React.useState(300);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // Bar height: scales with container, clamped 36px → 56px
  const barHeight = Math.min(220, Math.max(120, containerWidth * 0.5));

  // Title font: scales with container
  const titleSize = Math.max(11, Math.min(15, containerWidth * 0.045));

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full bg-white rounded-md"
      // style={{ border: "1.5px solid #c8d6e0" }}
    >
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 pt-2 pb-2">
        {data.map((d, i) => (
          <div
            key={d.label}
            className="flex items-center gap-1.5 cursor-pointer"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.4 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <span
              className="inline-block flex-shrink-0"
              style={{
                width: 13,
                height: 13,
                backgroundColor: d.color,
                borderRadius: 2,
              }}
            />
            <span
              className="font-semibold text-gray-700"
              style={{
                fontSize: Math.max(10, Math.min(13, containerWidth * 0.036)),
              }}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bar + axis */}
      <div className="px-3 pb-2">
        {/* Stacked bar */}
        <div
          className="flex w-full overflow-hidden"
          // , border: "1px solid #d1d5db"
          style={{ height: barHeight }}
        >
          {data.map((d, i) => (
            <div
              key={d.label}
              className="relative flex items-center justify-center cursor-pointer transition-opacity duration-200"
              style={{
                width: `${d.value}%`,
                backgroundColor: d.color,
                opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.5 : 1,
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* "Collection Status" label inside pink segment */}
              {i === 1 && (
                <span
                  className="font-bold select-none whitespace-nowrap"
                  style={{ color: "#e07b20", fontSize: titleSize }}
                >
                  Collection Status
                </span>
              )}
            </div>
          ))}
        </div>

        {/* X-axis ticks */}
        <div className="relative mt-1" style={{ height: "16px" }}>
          {ticks.map((v) => (
            <span
              key={v}
              className="absolute text-gray-500 -translate-x-1/2"
              style={{ left: `${v}%`, fontSize: "10px" }}
            >
              {v}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
