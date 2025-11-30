import type { CSSProperties } from "react";

type SpinnerProps = {
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
  label?: string;
};

export function Spinner({
  size = 40,
  strokeWidth = 4,
  style,
  label = "Cargando…",
}: SpinnerProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{ display: "inline-flex", ...style }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          opacity="0.15"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c * 0.25} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${size / 2} ${size / 2}`}
            to={`360 ${size / 2} ${size / 2}`}
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      {}
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}
