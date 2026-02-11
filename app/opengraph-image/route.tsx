import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(180deg, #1a1c26, #0f1016)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          color: "#e6e7ee",
          padding: "60px",
          gap: "16px"
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800 }}>Tower Jump</div>
        <div style={{ fontSize: 32, color: "#ffc857" }}>
          2.5D voxel tower climb
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
