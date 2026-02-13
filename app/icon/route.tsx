// ===========================================
// Dynamic Icon Generation
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
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20%',
        }}
      >
        {/* Tower icon */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Tower top */}
          <div
            style={{
              width: '60px',
              height: '20px',
              background: '#e94560',
              borderRadius: '4px 4px 0 0',
            }}
          />
          {/* Tower body */}
          <div
            style={{
              width: '80px',
              height: '100px',
              background: '#4a4a6a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '8px',
            }}
          >
            {/* Windows */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '50px',
                  height: '20px',
                  background: '#c9a227',
                  borderRadius: '4px',
                }}
              />
            ))}
          </div>
          {/* Tower base */}
          <div
            style={{
              width: '100px',
              height: '15px',
              background: '#3a3a5a',
              borderRadius: '0 0 4px 4px',
            }}
          />
        </div>
        {/* Arrow up */}
        <div
          style={{
            position: 'absolute',
            top: '25px',
            right: '25px',
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '25px solid #4ade80',
          }}
        />
      </div>
    ),
    {
      width: 200,
      height: 200,
    }
  );
}
