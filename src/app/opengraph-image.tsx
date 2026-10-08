import { ImageResponse } from 'next/og';

export const alt = 'The Shadow Bridge - Shadow Teachers & Special Education Tutors';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #241242 0%, #3B2A6B 45%, #7B1A66 85%, #B0206B 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '9999px',
            padding: '10px 28px',
            fontSize: 18,
            fontWeight: 700,
            color: '#FFD166',
            marginBottom: '28px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Special Education &amp; Child Support
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '16px',
            letterSpacing: '-1px',
          }}
        >
          The Shadow Bridge
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#E8DBF9',
            maxWidth: '960px',
            lineHeight: 1.4,
            marginBottom: '12px',
          }}
        >
          Connecting Families with Certified Shadow Teachers, Home Tutors &amp; Therapists
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#D2BEEB',
            maxWidth: '960px',
            lineHeight: 1.4,
            marginBottom: '36px',
          }}
        >
          Inclusive Classroom Assistance • ABA &amp; Speech Therapy • Special Needs Mentorship
        </div>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: 18,
            fontWeight: 600,
            color: '#ffffff',
            background: 'rgba(20, 8, 39, 0.55)',
            padding: '14px 36px',
            borderRadius: '18px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <span>Delhi NCR</span>
          <span>•</span>
          <span>Mumbai</span>
          <span>•</span>
          <span>Ahmedabad</span>
          <span>•</span>
          <span>Hyderabad</span>
          <span>•</span>
          <span>Bangalore</span>
          <span>•</span>
          <span>Pune</span>
          <span>•</span>
          <span>PAN-India Online</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
