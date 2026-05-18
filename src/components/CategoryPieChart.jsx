
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer, Sector } from "recharts";
import { useState } from "react";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export function CategoryPieChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data || data.length === 0) {
    return <p className="text-center text-slate-400 text-sm py-4">No expenses yet</p>;
  }

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div
      role="img"
      aria-label={`Spending breakdown: ${data.map(d => `${d.name} $${d.value.toFixed(2)}`).join(", ")}`}
      style={{ width: "100%", height: 320 }}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius="75%"
            innerRadius="40%"
            activeIndex={activeIndex}
            activeShape={(props) => (
              <g>
                <text
                  x={props.cx}
                  y={props.cy - 10}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontWeight="bold"
                  fontSize={13}
                >
                  {props.name}
                </text>
                <text
                  x={props.cx}
                  y={props.cy + 10}
                  textAnchor="middle"
                  fill="#4f46e5"
                  fontWeight="bold"
                  fontSize={13}
                >
                  ${props.value.toFixed(2)}
                </text>
                <Sector
                  cx={props.cx}
                  cy={props.cy}
                  innerRadius={props.innerRadius}
                  outerRadius={props.outerRadius + 8}
                  startAngle={props.startAngle}
                  endAngle={props.endAngle}
                  fill={props.fill}
                />
              </g>
            )}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={(_, index) =>
              setActiveIndex(prev => (prev === index ? null : index))
            }
            style={{ cursor: "pointer" }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
            contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Visually hidden data table for screen readers */}
      <table className="sr-only">
        <caption>Spending by category</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.name}>
              <td>{entry.name}</td>
              <td>${entry.value.toFixed(2)}</td>
              <td>{((entry.value / total) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
