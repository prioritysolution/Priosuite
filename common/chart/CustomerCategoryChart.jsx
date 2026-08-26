// "use client";

// import { useState, useEffect, useRef } from "react";

// const data = [
//   { label: "ST", value: 4086, hex: "#1d4ed8", textColor: "#ffffff" },
//   { label: "SC", value: 762, hex: "#22d3ee", textColor: "#111827" },
//   { label: "OBC", value: 658, hex: "#f97316", textColor: "#ffffff" },
//   { label: "Gen", value: 607, hex: "#ec4899", textColor: "#ffffff" },
//   { label: "SHG", value: 400, hex: "#facc15", textColor: "#111827" },
// ];

// const total = data.reduce((sum, d) => sum + d.value, 0);
// const maxTick = 10000;
// const SVG_W = 1000;
// const BAR_H = 36;
// const RADIUS = 5;

// const tickValues = Array.from({ length: 21 }, (_, i) => i * 500);
// const formatTick = (v) => {
//   if (v === 0) return "0";
//   if (v >= 1000) return `${v / 1000}k`;
//   return String(v);
// };

// const segments = data.map((d, i) => {
//   const start = data.slice(0, i).reduce((s, x) => s + x.value, 0);
//   const x = (start / maxTick) * SVG_W;
//   const w = (d.value / maxTick) * SVG_W;
//   return { ...d, x, w };
// });

// function roundedRect(x, y, w, h, r, isFirst, isLast) {
//   const tl = isFirst ? r : 0;
//   const bl = isFirst ? r : 0;
//   const tr = isLast ? r : 0;
//   const br = isLast ? r : 0;
//   return [
//     `M ${x + tl} ${y}`,
//     `H ${x + w - tr}`,
//     tr ? `Q ${x + w} ${y} ${x + w} ${y + tr}` : "",
//     `V ${y + h - br}`,
//     br ? `Q ${x + w} ${y + h} ${x + w - br} ${y + h}` : "",
//     `H ${x + bl}`,
//     bl ? `Q ${x} ${y + h} ${x} ${y + h - bl}` : "",
//     `V ${y + tl}`,
//     tl ? `Q ${x} ${y} ${x + tl} ${y}` : "",
//     "Z",
//   ]
//     .filter(Boolean)
//     .join(" ");
// }

// // Vertical segments for mobile — stacked top to bottom
// const VSVG_H = 1000;
// const BAR_W = 60;
// const vSegments = data.map((d, i) => {
//   const start = data.slice(0, i).reduce((s, x) => s + x.value, 0);
//   const y = (start / maxTick) * VSVG_H;
//   const h = (d.value / maxTick) * VSVG_H;
//   return { ...d, y, h };
// });

// function roundedRectV(x, y, w, h, r, isFirst, isLast) {
//   const tl = isFirst ? r : 0;
//   const tr = isFirst ? r : 0;
//   const bl = isLast ? r : 0;
//   const br = isLast ? r : 0;
//   return [
//     `M ${x + tl} ${y}`,
//     `H ${x + w - tr}`,
//     tr ? `Q ${x + w} ${y} ${x + w} ${y + tr}` : "",
//     `V ${y + h - br}`,
//     br ? `Q ${x + w} ${y + h} ${x + w - br} ${y + h}` : "",
//     `H ${x + bl}`,
//     bl ? `Q ${x} ${y + h} ${x} ${y + h - bl}` : "",
//     `V ${y + tl}`,
//     tl ? `Q ${x} ${y} ${x + tl} ${y}` : "",
//     "Z",
//   ]
//     .filter(Boolean)
//     .join(" ");
// }

// export default function SocialCategoryChart() {
//   const [hoveredIdx, setHoveredIdx] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 768);
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   return (
//     <div className="w-full" ref={containerRef}>
//       <div className="w-full bg-white rounded-2xl">
//         {/* Legend */}
//         <div className="flex flex-wrap gap-3 justify-center mb-6">
//           {data.map((d, i) => (
//             <div
//               key={d.label}
//               className="flex items-center gap-1.5 cursor-pointer group"
//               onMouseEnter={() => setHoveredIdx(i)}
//               onMouseLeave={() => setHoveredIdx(null)}
//             >
//               <span
//                 className="inline-block w-4 h-4 rounded-sm flex-shrink-0 transition-transform group-hover:scale-110"
//                 style={{ backgroundColor: d.hex }}
//               />
//               <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
//                 {d.label}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* ── DESKTOP: horizontal bar ── */}
//         {!isMobile && (
//           <div className="flex items-start gap-3 sm:gap-4">
//             <div className="w-24 sm:w-32 flex-shrink-0 text-right pt-2">
//               <span className="text-xs font-semibold text-gray-600 leading-tight">
//                 Customer By
//                 <br />
//                 Social Category
//               </span>
//             </div>

//             <div className="flex-1 min-w-0">
//               <svg
//                 viewBox={`0 0 ${SVG_W} 60`}
//                 preserveAspectRatio="none"
//                 className="w-full"
//                 style={{
//                   height: "52px",
//                   display: "block",
//                   overflow: "visible",
//                 }}
//               >
//                 {/* BG track */}
//                 <rect
//                   x="0"
//                   y="0"
//                   width={SVG_W}
//                   height={BAR_H}
//                   rx={RADIUS}
//                   ry={RADIUS}
//                   fill="#f3f4f6"
//                   stroke="#e5e7eb"
//                   strokeWidth="1"
//                 />

//                 {segments.map((seg, i) => {
//                   const isFirst = i === 0;
//                   const isLast = i === data.length - 1;
//                   const isHovered = hoveredIdx === i;
//                   const path = roundedRect(
//                     seg.x,
//                     0,
//                     seg.w,
//                     BAR_H,
//                     RADIUS,
//                     isFirst,
//                     isLast,
//                   );
//                   return (
//                     <g key={seg.label}>
//                       <path
//                         d={path}
//                         fill={seg.hex}
//                         opacity={hoveredIdx !== null && !isHovered ? 0.45 : 1}
//                         style={{
//                           cursor: "pointer",
//                           transition: "opacity 0.2s",
//                         }}
//                         onMouseEnter={() => setHoveredIdx(i)}
//                         onMouseLeave={() => setHoveredIdx(null)}
//                       />
//                       {seg.w > 35 && (
//                         <text
//                           x={seg.x + seg.w / 2}
//                           y="22"
//                           textAnchor="middle"
//                           fill={seg.textColor}
//                           fontSize={seg.w < 75 ? "9" : "11"}
//                           fontWeight="700"
//                           style={{ pointerEvents: "none", userSelect: "none" }}
//                         >
//                           {seg.value.toLocaleString()}
//                         </text>
//                       )}
//                     </g>
//                   );
//                 })}

//                 {tickValues.map((v) => {
//                   const x = (v / maxTick) * SVG_W;
//                   return (
//                     <line
//                       key={v}
//                       x1={x}
//                       y1={BAR_H}
//                       x2={x}
//                       y2={BAR_H + 6}
//                       stroke="#d1d5db"
//                       strokeWidth="1"
//                     />
//                   );
//                 })}
//                 {tickValues.map((v) => {
//                   const x = (v / maxTick) * SVG_W;
//                   return (
//                     <text
//                       key={v}
//                       x={x}
//                       y="56"
//                       textAnchor="middle"
//                       fill="#9ca3af"
//                       fontSize="8"
//                     >
//                       {formatTick(v)}
//                     </text>
//                   );
//                 })}
//               </svg>

//               {hoveredIdx !== null && (
//                 <div className="mt-1 text-xs bg-gray-900 text-white rounded-lg px-3 py-1.5 inline-block">
//                   <span className="font-semibold">
//                     {data[hoveredIdx].label}
//                   </span>
//                   : {data[hoveredIdx].value.toLocaleString()}
//                   <span className="ml-1 text-gray-300">
//                     ({((data[hoveredIdx].value / total) * 100).toFixed(1)}%)
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ── MOBILE: vertical stacked bar with labels on right ── */}
//         {isMobile && (
//           <div className="w-full">
//             <p className="text-xs font-semibold text-gray-600 text-center mb-3">
//               Customer By Social Category
//             </p>

//             <div className="flex gap-3 justify-center items-flex-start">
//               {/* Vertical SVG bar */}
//               <svg
//                 viewBox={`0 0 100 1060`}
//                 style={{ width: "60px", flexShrink: 0, overflow: "visible" }}
//               >
//                 {/* BG track */}
//                 <rect
//                   x="20"
//                   y="0"
//                   width={BAR_W}
//                   height={VSVG_H}
//                   rx={RADIUS}
//                   ry={RADIUS}
//                   fill="#f3f4f6"
//                   stroke="#e5e7eb"
//                   strokeWidth="1"
//                 />

//                 {vSegments.map((seg, i) => {
//                   const isFirst = i === 0;
//                   const isLast = i === data.length - 1;
//                   const isHovered = hoveredIdx === i;
//                   const path = roundedRectV(
//                     20,
//                     seg.y,
//                     BAR_W,
//                     seg.h,
//                     RADIUS,
//                     isFirst,
//                     isLast,
//                   );
//                   return (
//                     <g key={seg.label}>
//                       <path
//                         d={path}
//                         fill={seg.hex}
//                         opacity={hoveredIdx !== null && !isHovered ? 0.45 : 1}
//                         style={{
//                           cursor: "pointer",
//                           transition: "opacity 0.2s",
//                         }}
//                         onMouseEnter={() => setHoveredIdx(i)}
//                         onMouseLeave={() => setHoveredIdx(null)}
//                       />
//                       {/* value label inside segment if tall enough */}
//                       {seg.h > 50 && (
//                         <text
//                           x={20 + BAR_W / 2}
//                           y={seg.y + seg.h / 2 + 4}
//                           textAnchor="middle"
//                           fill={seg.textColor}
//                           fontSize="10"
//                           fontWeight="700"
//                           style={{ pointerEvents: "none", userSelect: "none" }}
//                         >
//                           {seg.value.toLocaleString()}
//                         </text>
//                       )}
//                     </g>
//                   );
//                 })}

//                 {/* Y-axis ticks every 1k */}
//                 {[
//                   0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
//                   10000,
//                 ].map((v) => {
//                   const y = (v / maxTick) * VSVG_H;
//                   return (
//                     <g key={v}>
//                       <line
//                         x1="14"
//                         y1={y}
//                         x2="20"
//                         y2={y}
//                         stroke="#d1d5db"
//                         strokeWidth="1"
//                       />
//                       <text
//                         x="12"
//                         y={y + 3}
//                         textAnchor="end"
//                         fill="#9ca3af"
//                         fontSize="8"
//                       >
//                         {formatTick(v)}
//                       </text>
//                     </g>
//                   );
//                 })}
//               </svg>

//               {/* Category labels stacked on right */}
//               <div className="flex flex-col" style={{ height: "250px" }}>
//                 {vSegments.map((seg, i) => {
//                   const topPct = (seg.y / VSVG_H) * 100;
//                   const heightPct = (seg.h / VSVG_H) * 100;
//                   return (
//                     <div
//                       key={seg.label}
//                       className="flex items-center gap-1.5 cursor-pointer"
//                       style={{ height: `${heightPct}%`, minHeight: "18px" }}
//                       onMouseEnter={() => setHoveredIdx(i)}
//                       onMouseLeave={() => setHoveredIdx(null)}
//                     >
//                       <span
//                         className="w-2 h-2 rounded-full flex-shrink-0"
//                         style={{ backgroundColor: seg.hex }}
//                       />
//                       <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
//                         {seg.label}
//                         <span className="ml-1 font-normal text-gray-400">
//                           {seg.value.toLocaleString()}
//                         </span>
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {hoveredIdx !== null && (
//               <div className="mt-2 text-center text-xs bg-gray-900 text-white rounded-lg px-3 py-1.5 inline-block mx-auto block w-fit">
//                 <span className="font-semibold">{data[hoveredIdx].label}</span>:{" "}
//                 {data[hoveredIdx].value.toLocaleString()}
//                 <span className="ml-1 text-gray-300">
//                   ({((data[hoveredIdx].value / total) * 100).toFixed(1)}%)
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";

// const data = [
//   { label: "ST", value: 4086, hex: "#1d4ed8", textColor: "#ffffff" },
//   { label: "SC", value: 762, hex: "#22d3ee", textColor: "#111827" },
//   { label: "OBC", value: 658, hex: "#f97316", textColor: "#ffffff" },
//   { label: "Gen", value: 607, hex: "#ec4899", textColor: "#ffffff" },
//   { label: "SHG", value: 400, hex: "#facc15", textColor: "#111827" },
// ];

// const total = data.reduce((sum, d) => sum + d.value, 0);
// const maxTick = 10000;
// const SVG_W = 1000;
// const BAR_H = 36;
// const RADIUS = 5;

// const tickValues = Array.from({ length: 21 }, (_, i) => i * 500);
// const formatTick = (v) => {
//   if (v === 0) return "0";
//   if (v >= 1000) return `${v / 1000}k`;
//   return String(v);
// };

// const segments = data.map((d, i) => {
//   const start = data.slice(0, i).reduce((s, x) => s + x.value, 0);
//   return { ...d, x: (start / maxTick) * SVG_W, w: (d.value / maxTick) * SVG_W };
// });

// function roundedRectH(x, y, w, h, r, isFirst, isLast) {
//   const tl = isFirst ? r : 0,
//     bl = isFirst ? r : 0;
//   const tr = isLast ? r : 0,
//     br = isLast ? r : 0;
//   return [
//     `M ${x + tl} ${y}`,
//     `H ${x + w - tr}`,
//     tr ? `Q ${x + w} ${y} ${x + w} ${y + tr}` : "",
//     `V ${y + h - br}`,
//     br ? `Q ${x + w} ${y + h} ${x + w - br} ${y + h}` : "",
//     `H ${x + bl}`,
//     bl ? `Q ${x} ${y + h} ${x} ${y + h - bl}` : "",
//     `V ${y + tl}`,
//     tl ? `Q ${x} ${y} ${x + tl} ${y}` : "",
//     "Z",
//   ]
//     .filter(Boolean)
//     .join(" ");
// }

// export default function SocialCategoryChart() {
//   const [hoveredIdx, setHoveredIdx] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 768);
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   return (
//     <div className="w-full">
//       <div className="w-full bg-white rounded-2xl">
//         {/* Legend — desktop only */}
//         {!isMobile && (
//           <div className="flex flex-wrap gap-3 justify-center mb-6">
//             {data.map((d, i) => (
//               <div
//                 key={d.label}
//                 className="flex items-center gap-1.5 cursor-pointer group"
//                 onMouseEnter={() => setHoveredIdx(i)}
//                 onMouseLeave={() => setHoveredIdx(null)}
//               >
//                 <span
//                   className="inline-block w-4 h-4 rounded-sm flex-shrink-0 transition-transform group-hover:scale-110"
//                   style={{ backgroundColor: d.hex }}
//                 />
//                 <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
//                   {d.label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── DESKTOP: single stacked horizontal bar ── */}
//         {!isMobile && (
//           <div className="flex items-start gap-4">
//             <div className="w-32 flex-shrink-0 text-right ">
//               <span className="text-xs font-semibold text-gray-600 leading-tight">
//                 Customer By
//                 <br />
//                 Social Category
//               </span>
//             </div>
//             <div className="flex-1 min-w-0">
//               <svg
//                 viewBox={`0 0 ${SVG_W} 60`}
//                 preserveAspectRatio="none"
//                 className="w-full"
//                 style={{
//                   height: "52px",
//                   display: "block",
//                   overflow: "visible",
//                 }}
//               >
//                 <rect
//                   x="0"
//                   y="0"
//                   width={SVG_W}
//                   height={BAR_H}
//                   rx={RADIUS}
//                   ry={RADIUS}
//                   fill="#f3f4f6"
//                   stroke="#e5e7eb"
//                   strokeWidth="1"
//                 />
//                 {segments.map((seg, i) => {
//                   const path = roundedRectH(
//                     seg.x,
//                     0,
//                     seg.w,
//                     BAR_H,
//                     RADIUS,
//                     i === 0,
//                     i === data.length - 1,
//                   );
//                   return (
//                     <g key={seg.label}>
//                       <path
//                         d={path}
//                         fill={seg.hex}
//                         opacity={
//                           hoveredIdx !== null && hoveredIdx !== i ? 0.45 : 1
//                         }
//                         style={{
//                           cursor: "pointer",
//                           transition: "opacity 0.2s",
//                         }}
//                         onMouseEnter={() => setHoveredIdx(i)}
//                         onMouseLeave={() => setHoveredIdx(null)}
//                       />
//                       {seg.w > 35 && (
//                         <text
//                           x={seg.x + seg.w / 2}
//                           y="22"
//                           textAnchor="middle"
//                           fill={seg.textColor}
//                           fontSize={seg.w < 75 ? "9" : "11"}
//                           fontWeight="700"
//                           style={{ pointerEvents: "none", userSelect: "none" }}
//                         >
//                           {seg.value.toLocaleString()}
//                         </text>
//                       )}
//                     </g>
//                   );
//                 })}
//                 {tickValues.map((v) => {
//                   const x = (v / maxTick) * SVG_W;
//                   return (
//                     <line
//                       key={v}
//                       x1={x}
//                       y1={BAR_H}
//                       x2={x}
//                       y2={BAR_H + 6}
//                       stroke="#d1d5db"
//                       strokeWidth="1"
//                     />
//                   );
//                 })}
//                 {tickValues.map((v) => {
//                   const x = (v / maxTick) * SVG_W;
//                   return (
//                     <text
//                       key={v}
//                       x={x}
//                       y="56"
//                       textAnchor="middle"
//                       fill="#9ca3af"
//                       fontSize="8"
//                     >
//                       {formatTick(v)}
//                     </text>
//                   );
//                 })}
//               </svg>
//               {hoveredIdx !== null && (
//                 <div className="mt-1 text-xs bg-gray-900 text-white rounded-lg px-3 py-1.5 inline-block">
//                   <span className="font-semibold">
//                     {data[hoveredIdx].label}
//                   </span>
//                   : {data[hoveredIdx].value.toLocaleString()}
//                   <span className="ml-1 text-gray-300">
//                     ({((data[hoveredIdx].value / total) * 100).toFixed(1)}%)
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ── MOBILE/TABLET: one horizontal bar per category, stacked vertically ── */}
//         {isMobile && (
//           <div className="w-full space-y-3">
//             <p className="text-xs font-semibold text-gray-500 text-center mb-2 uppercase tracking-widest">
//               Customer By Social Category
//             </p>

//             {data.map((d, i) => {
//               const barPct = (d.value / maxTick) * 100; // width % relative to maxTick
//               const isHovered = hoveredIdx === i;
//               return (
//                 <div
//                   key={d.label}
//                   className="flex items-center gap-2 cursor-pointer"
//                   onMouseEnter={() => setHoveredIdx(i)}
//                   onMouseLeave={() => setHoveredIdx(null)}
//                   onTouchStart={() =>
//                     setHoveredIdx(hoveredIdx === i ? null : i)
//                   }
//                 >
//                   {/* Label */}
//                   <div className="w-8 flex-shrink-0 text-right">
//                     <span className="text-xs font-bold text-gray-600">
//                       {d.label}
//                     </span>
//                   </div>

//                   {/* Bar track */}
//                   <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
//                     {/* Filled portion */}
//                     <div
//                       className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-300"
//                       style={{
//                         width: `${barPct}%`,
//                         backgroundColor: d.hex,
//                         opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
//                         minWidth: "36px",
//                       }}
//                     >
//                       <span
//                         className="text-xs font-bold select-none whitespace-nowrap"
//                         style={{ color: d.textColor }}
//                       >
//                         {d.value.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Percentage */}
//                   <div className="w-10 flex-shrink-0 text-left">
//                     <span className="text-xs text-gray-400">
//                       {((d.value / total) * 100).toFixed(1)}%
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Axis ticks — 0 to 10k */}
//             <div className="flex items-center gap-2 mt-1">
//               <div className="w-8 flex-shrink-0" />
//               <div className="flex-1 relative" style={{ height: "16px" }}>
//                 {[0, 2000, 4000, 6000, 8000, 10000].map((v) => (
//                   <span
//                     key={v}
//                     className="absolute text-xs text-gray-400 -translate-x-1/2"
//                     style={{ left: `${(v / maxTick) * 100}%` }}
//                   >
//                     {formatTick(v)}
//                   </span>
//                 ))}
//               </div>
//               <div className="w-10 flex-shrink-0" />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

const data = [
  { label: "ST", value: 4086, hex: "#1d4ed8", textColor: "#ffffff" },
  { label: "SC", value: 762, hex: "#22d3ee", textColor: "#111827" },
  { label: "OBC", value: 658, hex: "#f97316", textColor: "#ffffff" },
  { label: "Gen", value: 607, hex: "#ec4899", textColor: "#ffffff" },
  { label: "SHG", value: 400, hex: "#facc15", textColor: "#111827" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);
const maxTick = 10000;
const SVG_W = 1000;
const BAR_H = 36;
const RADIUS = 5;

const tickValues = Array.from({ length: 21 }, (_, i) => i * 500);
const formatTick = (v) => {
  if (v === 0) return "0";
  if (v >= 1000) return `${v / 1000}k`;
  return String(v);
};

const segments = data.map((d, i) => {
  const start = data.slice(0, i).reduce((s, x) => s + x.value, 0);
  return { ...d, x: (start / maxTick) * SVG_W, w: (d.value / maxTick) * SVG_W };
});

function roundedRectH(x, y, w, h, r, isFirst, isLast) {
  const tl = isFirst ? r : 0,
    bl = isFirst ? r : 0;
  const tr = isLast ? r : 0,
    br = isLast ? r : 0;
  return [
    `M ${x + tl} ${y}`,
    `H ${x + w - tr}`,
    tr ? `Q ${x + w} ${y} ${x + w} ${y + tr}` : "",
    `V ${y + h - br}`,
    br ? `Q ${x + w} ${y + h} ${x + w - br} ${y + h}` : "",
    `H ${x + bl}`,
    bl ? `Q ${x} ${y + h} ${x} ${y + h - bl}` : "",
    `V ${y + tl}`,
    tl ? `Q ${x} ${y} ${x + tl} ${y}` : "",
    "Z",
  ]
    .filter(Boolean)
    .join(" ");
}

// Legend — same for both layouts
function Legend({ hoveredIdx, setHoveredIdx }) {
  return (
    <div className="flex justify-center  flex-wrap gap-x-4 gap-y-1 items-center mb-2 px-1">
      {data.map((d, i) => (
        <div
          key={d.label}
          className="flex items-center gap-1.5 cursor-pointer"
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <span
            className="inline-block w-3.5 h-3.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: d.hex }}
          />
          <span className="text-xs text-gray-700 font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function SocialCategoryChart() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="w-full font-sans">
      {/* ── DESKTOP: matches original image exactly ── */}
      {!isMobile && (
        // border border-gray-300 rounded-md
        <div className="w-full bg-white p-3">
          {/* Legend row */}
          <Legend hoveredIdx={hoveredIdx} setHoveredIdx={setHoveredIdx} />

          {/* Chart row */}
          <div className="flex items-center gap-0 ">
            {/* border border-gray-300 rounded-sm */}
            {/* Left label cell */}
            <div
              className="flex-shrink-0 px-1 sm:px-2 py-1"
              style={{ width: "min(110px, 28%)" }}
            >
              {/* border-r border-gray-300 */}
              <span className="text-xs font-semibold text-gray-700 leading-tight block">
                Customer By
                <br />
                Social Category
              </span>
            </div>

            {/* Bar + axis cell */}
            <div className="flex-1  min-w-0 px-2 py-1">
              <svg
                viewBox={`0 0 ${SVG_W} 58`}
                preserveAspectRatio="none"
                className="w-full"
                style={{
                  height: "50px",
                  display: "block",
                  overflow: "visible",
                }}
              >
                {/* BG track */}
                <rect
                  x="0"
                  y="0"
                  width={SVG_W}
                  height={BAR_H}
                  rx={RADIUS}
                  ry={RADIUS}
                  fill="#f0f0f0"
                  stroke="#d1d5db"
                  strokeWidth="1"
                />

                {/* Colored segments */}
                {segments.map((seg, i) => {
                  const path = roundedRectH(
                    seg.x,
                    0,
                    seg.w,
                    BAR_H,
                    RADIUS,
                    i === 0,
                    i === data.length - 1,
                  );
                  return (
                    <g key={seg.label}>
                      <path
                        d={path}
                        fill={seg.hex}
                        opacity={
                          hoveredIdx !== null && hoveredIdx !== i ? 0.4 : 1
                        }
                        style={{
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      />
                      {seg.w > 30 && (
                        <text
                          x={seg.x + seg.w / 2}
                          y="23"
                          textAnchor="middle"
                          fill={seg.textColor}
                          fontSize={seg.w < 70 ? "9" : "12"}
                          fontWeight="700"
                          style={{ pointerEvents: "none", userSelect: "none" }}
                        >
                          {seg.value.toLocaleString()}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Tick marks */}
                {tickValues.map((v) => {
                  const x = (v / maxTick) * SVG_W;
                  return (
                    <line
                      key={v}
                      x1={x}
                      y1={BAR_H}
                      x2={x}
                      y2={BAR_H + 5}
                      stroke="#9ca3af"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Tick labels */}
                {tickValues.map((v) => {
                  const x = (v / maxTick) * SVG_W;
                  return (
                    <text
                      key={v}
                      x={x}
                      y="55"
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="7.5"
                    >
                      {formatTick(v)}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Tooltip */}
          {/* {hoveredIdx !== null && (
            <div className="mt-1 text-xs bg-gray-800 text-white rounded px-2 py-1 inline-block">
              <span className="font-semibold">{data[hoveredIdx].label}</span>:{" "}
              {data[hoveredIdx].value.toLocaleString()}
              <span className="ml-1 text-gray-300">
                ({((data[hoveredIdx].value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          )} */}
        </div>
      )}

      {/* ── MOBILE / TABLET: one row per category ── */}
      {isMobile && (
        <div className="w-full border border-gray-300 rounded-md bg-white p-3">
          {/* Legend */}
          <Legend hoveredIdx={hoveredIdx} setHoveredIdx={setHoveredIdx} />

          {/* Title */}
          <div className="text-xs font-semibold text-gray-700 mb-3 border-t border-gray-200 pt-2">
            Customer By Social Category
          </div>

          {/* One bar per category */}
          <div className="space-y-2">
            {data.map((d, i) => {
              const barPct = (d.value / maxTick) * 100;
              const isHovered = hoveredIdx === i;
              return (
                <div
                  key={d.label}
                  className="flex items-center gap-2"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onTouchStart={() =>
                    setHoveredIdx(hoveredIdx === i ? null : i)
                  }
                >
                  {/* Label */}
                  <span className="text-xs font-bold text-gray-600 w-7 flex-shrink-0 text-right">
                    {d.label}
                  </span>

                  {/* Track */}
                  <div className="flex-1 h-7 bg-gray-100 rounded overflow-hidden border border-gray-200">
                    <div
                      className="h-full rounded flex items-center justify-end pr-2 transition-all duration-300"
                      style={{
                        width: `${barPct}%`,
                        backgroundColor: d.hex,
                        opacity: hoveredIdx !== null && !isHovered ? 0.4 : 1,
                        minWidth: "32px",
                      }}
                    >
                      <span
                        className="text-xs font-bold whitespace-nowrap select-none"
                        style={{ color: d.textColor }}
                      >
                        {d.value.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* % */}
                  <span className="text-xs text-gray-400 w-9 flex-shrink-0">
                    {((d.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="flex mt-2 pl-9 pr-9">
            <div className="flex-1 relative" style={{ height: "14px" }}>
              {[0, 2000, 4000, 6000, 8000, 10000].map((v) => (
                <span
                  key={v}
                  className="absolute text-xs text-gray-400 -translate-x-1/2"
                  style={{ left: `${(v / maxTick) * 100}%`, fontSize: "10px" }}
                >
                  {formatTick(v)}
                </span>
              ))}
            </div>
          </div>

          {/* Tap tooltip */}
          {/* {hoveredIdx !== null && (
            <div className="mt-2 text-xs bg-gray-800 text-white rounded px-2 py-1 inline-block">
              <span className="font-semibold">{data[hoveredIdx].label}</span>:{" "}
              {data[hoveredIdx].value.toLocaleString()}
              <span className="ml-1 text-gray-300">
                ({((data[hoveredIdx].value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
