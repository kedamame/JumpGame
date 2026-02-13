// ===========================================
// Dynamic OpenGraph Image Generation
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
          background: 'linear-gradient(180deg, #16213e 0%, #1a1a2e 100%)',
          fontFamily: 'monospace',
        }}
      >
        {/* Tower illustration */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Tower segments */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: `${160 - i * 15}px`,
                height: '50px',
                background: i % 2 === 0 ? '#4a4a6a' : '#3a3a5a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '2px solid #2a2a4a',
              }}
            >
              {/* Window */}
              <div
                style={{
                  width: '40px',
                  height: '30px',
                  background: '#c9a227',
                  borderRadius: '4px',
                  boxShadow: '0 0 20px rgba(201, 162, 39, 0.5)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#e94560',
            textShadow: '4px 4px 0px #000',
            marginBottom: '20px',
          }}
        >
          TOWER JUMP
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#ffffff',
            opacity: 0.8,
          }}
        >
          Climb the endless tower on Base
        </div>

        {/* Farcaster badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(138, 92, 246, 0.3)',
            padding: '10px 20px',
            borderRadius: '20px',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              background: '#8b5cf6',
              borderRadius: '50%',
            }}
          />
          <span style={{ color: '#fff', fontSize: '20px' }}>Farcaster Mini App</span>
        </div>

        {/* Base logo */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              background: '#0052ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            B
          </div>
          <span style={{ color: '#fff', fontSize: '20px' }}>Base</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
