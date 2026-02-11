import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const manifest = {
    name: "Tower Jump",
    description: "2.5D voxel tower climb mini app.",
    iconUrl: `${baseUrl}/icon`,
    splashImageUrl: `${baseUrl}/splash`,
    homeUrl: baseUrl,
    requiredCapabilities: [
      "wallet.getEthereumProvider",
      "actions.ready"
    ],
    accountAssociation: {
      header: "0x0000000000000000000000000000000000000000",
      payload: "0x00",
      signature: "0x00"
    }
  };

  return NextResponse.json(manifest);
}
