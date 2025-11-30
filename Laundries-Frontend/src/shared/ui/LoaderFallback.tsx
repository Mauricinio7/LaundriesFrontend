import { Spinner } from "./Spinner";

export function LoaderFallback() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "40vh",
        padding: 16,
      }}
    >
      <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
        <Spinner size={44} strokeWidth={4} />
        <p style={{ margin: 0, opacity: 0.7 }}>Cargando…</p>
      </div>
    </div>
  );
}
