import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f1016, #1b1d27)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#e6e7ee",
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: 2
        }}
      >
        TOWER JUMP
      </div>
    ),
    {
      width: 1200,
      height: 1200
    }
  );
}
