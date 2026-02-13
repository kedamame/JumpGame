// ===========================================
// Farcaster Manifest Route
// ===========================================

import { NextResponse } from 'next/server';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET() {
  const manifest = {
    // Account association - MUST be signed by your custody address
    // See README.md for instructions on generating this signature
    accountAssociation: {
      header: 'REPLACE_WITH_SIGNED_HEADER',
      payload: 'REPLACE_WITH_SIGNED_PAYLOAD',
      signature: 'REPLACE_WITH_SIGNATURE',
    },
    frame: {
      version: 'next',
      name: 'Tower Jump',
      iconUrl: `${appUrl}/icon`,
      homeUrl: appUrl,
      splashImageUrl: `${appUrl}/splash`,
      splashBackgroundColor: '#1a1a2e',
      // Require wallet and ready capabilities
      requiredCapabilities: [
        'wallet.getEthereumProvider',
        'actions.ready',
      ],
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
