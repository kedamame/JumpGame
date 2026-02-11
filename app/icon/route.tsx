import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #2a2f3b, #111218)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffc857",
          fontSize: 64,
          fontWeight: 800
        }}
      >
        TJ
      </div>
    ),
    {
      width: 512,
      height: 512
    }
  );
}
