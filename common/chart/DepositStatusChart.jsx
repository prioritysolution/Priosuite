// "use client";

// import * as React from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const depositData = [
//   { name: "SB", value: 64, color: "#14b8a6" },
//   { name: "RD", value: 13, color: "#ef4444" },
//   { name: "FD", value: 12, color: "#22c55e" },
//   { name: "MIS", value: 11, color: "#06b6d4" },
// ];

// const RADIAN = Math.PI / 180;

// const renderLabel = (props) => {
//   const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor="middle"
//       dominantBaseline="middle"
//       fontSize={12}
//       fontWeight="bold"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// export default function DepositStatusChart() {
//   const [activeIdx, setActiveIdx] = React.useState(null);
//   const containerRef = React.useRef(null);
//   const [containerWidth, setContainerWidth] = React.useState(300);

//   // Dynamically measure container width for responsive chart size
//   React.useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const ro = new ResizeObserver(([entry]) => {
//       setContainerWidth(entry.contentRect.width);
//     });
//     ro.observe(el);
//     setContainerWidth(el.offsetWidth);
//     return () => ro.disconnect();
//   }, []);

//   // Chart size: 50% of container width, clamped between 120px and 220px
//   const chartSize = Math.min(220, Math.max(120, containerWidth * 0.5));

//   return (
//     <div
//       ref={containerRef}
//       className="flex flex-col w-full bg-white rounded-md"
//       // style={{ border: "1.5px solid #c8d6e0" }}
//     >
//       {/* Title — orange, top right */}
//       <div className="px-4 pt-3 pb-1 flex ">
//         <span className="font-bold text-base" style={{ color: "#e07b20" }}>
//           Deposit Status
//         </span>
//       </div>

//       {/* Chart + Legend — always side by side */}
//       <div className="flex items-center w-full px-2 pb-3 gap-3">
//         {/* Donut — responsive size */}
//         <div style={{ width: chartSize, height: chartSize, flexShrink: 0 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={depositData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius="40%"
//                 outerRadius="78%"
//                 dataKey="value"
//                 label={renderLabel}
//                 strokeWidth={2}
//                 stroke="#fff"
//                 startAngle={90}
//                 endAngle={-270}
//               >
//                 {depositData.map((entry, i) => (
//                   <Cell
//                     key={entry.name}
//                     fill={entry.color}
//                     opacity={activeIdx !== null && activeIdx !== i ? 0.45 : 1}
//                     style={{ cursor: "pointer", transition: "opacity 0.2s" }}
//                     onMouseEnter={() => setActiveIdx(i)}
//                     onMouseLeave={() => setActiveIdx(null)}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip
//                 formatter={(value, name) => [`${value}%`, name]}
//                 contentStyle={{
//                   fontSize: 12,
//                   borderRadius: 6,
//                   border: "1px solid #e5e7eb",
//                 }}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Legend — fills remaining space, vertical */}
//         <div className="flex flex-col gap-2 flex-1 min-w-0">
//           {depositData.map((d, i) => (
//             <div
//               key={d.name}
//               className="flex items-center gap-2 cursor-pointer"
//               onMouseEnter={() => setActiveIdx(i)}
//               onMouseLeave={() => setActiveIdx(null)}
//               style={{
//                 opacity: activeIdx !== null && activeIdx !== i ? 0.4 : 1,
//                 transition: "opacity 0.2s",
//               }}
//             >
//               <span
//                 className="inline-block rounded-full flex-shrink-0"
//                 style={{ width: 11, height: 11, backgroundColor: d.color }}
//               />
//               <span
//                 className="font-semibold text-gray-700 truncate"
//                 style={{
//                   fontSize: Math.max(10, Math.min(13, containerWidth * 0.04)),
//                 }}
//               >
//                 {d.name}: {d.value}%
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const depositData = [
  { name: "SB", value: 64, color: "#14b8a6" },
  { name: "RD", value: 13, color: "#ef4444" },
  { name: "FD", value: 12, color: "#22c55e" },
  { name: "MIS", value: 11, color: "#06b6d4" },
];

const RADIAN = Math.PI / 180;

export default function DepositStatusChart({ showTitle = true }) {
  const [activeIdx, setActiveIdx] = React.useState(null);
  const containerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = React.useState(300);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const roundedWidth = Math.round(entry.contentRect.width / 10) * 10;
      setContainerWidth(roundedWidth);
    });
    ro.observe(el);
    setContainerWidth(Math.round(el.offsetWidth / 10) * 10);
    return () => ro.disconnect();
  }, []);

  const chartSize = Math.min(
    200,
    Math.max(110, Math.min(containerWidth * 0.48, containerWidth - 100)),
  );
  const cx = chartSize / 2;
  const cy = chartSize / 2;
  const innerR = chartSize * 0.28;
  const outerR = chartSize * 0.46;

  // Custom label renderer using absolute pixel radii
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.max(9, chartSize * 0.07)}
        fontWeight="bold"
        style={{ pointerEvents: "none" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full bg-white rounded-md"
      style={{ outline: "none", border: "none" }}
    >
      {showTitle ? (
        <div className="px-3 sm:px-4 pt-2 sm:pt-3 pb-1 flex">
          <span
            className="font-bold text-sm sm:text-base"
            style={{ color: "#e07b20" }}
          >
            Deposit Status
          </span>
        </div>
      ) : null}

      <div className="flex flex-row items-center w-full px-2 pb-2 sm:pb-3 gap-2 sm:gap-3 min-w-0">
        <div className="shrink-0">
          <PieChart
            width={chartSize}
            height={chartSize}
            style={{ outline: "none", border: "none" }}
          >
            <Pie
              data={depositData}
              cx={cx}
              cy={cy}
              innerRadius={innerR}
              outerRadius={outerR}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              label={renderLabel}
              strokeWidth={2}
              stroke="#fff"
              isAnimationActive={false}
            >
              {depositData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  opacity={activeIdx !== null && activeIdx !== i ? 0.45 : 1}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
              }}
            />
          </PieChart>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {depositData.map((d, i) => (
            <div
              key={d.name}
              className="flex items-center gap-2 cursor-pointer"
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              style={{
                opacity: activeIdx !== null && activeIdx !== i ? 0.4 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <span
                className="inline-block rounded-full flex-shrink-0"
                style={{ width: 11, height: 11, backgroundColor: d.color }}
              />
              <span
                className="font-semibold text-gray-700 truncate"
                style={{
                  fontSize: Math.max(10, Math.min(13, containerWidth * 0.04)),
                }}
              >
                {d.name}: {d.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
