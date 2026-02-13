// ===========================================
// Dynamic Splash Image Generation
// ===========================================

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a2e',
          fontFamily: 'monospace',
        }}
      >
        {/* Animated tower icon */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          {/* Tower top */}
          <div
            style={{
              width: '40px',
              height: '15px',
              background: '#e94560',
              borderRadius: '4px 4px 0 0',
            }}
          />
          {/* Tower body */}
          <div
            style={{
              width: '60px',
              height: '80px',
              background: '#4a4a6a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '5px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '40px',
                  height: '18px',
                  background: '#c9a227',
                  borderRadius: '3px',
                }}
              />
            ))}
          </div>
          {/* Tower base */}
          <div
            style={{
              width: '80px',
              height: '12px',
              background: '#3a3a5a',
              borderRadius: '0 0 4px 4px',
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#e94560',
            marginBottom: '10px',
          }}
        >
          TOWER JUMP
        </div>

        {/* Loading indicator */}
        <div
          style={{
            fontSize: '18px',
            color: '#888',
          }}
        >
          Loading...
        </div>
      </div>
    ),
    {
      width: 400,
      height: 400,
    }
  );
}
