import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
    width: 512,
    height: 512,
};
export const contentType = 'image/png';

// Route segment config (Next.js forces dynamic rendering for OG images unless static)
export const runtime = 'edge';

// We render a beautiful, scalable, transparent 2D retro camera manually using SVG
export default function Icon() {
    return new ImageResponse(
        (
            // The background is entirely transparent
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="400"
                    height="400"
                    viewBox="7.5 13.5 74 68"
                    fill="none"
                >
                    {/* Main camera body (dark blueish retro color) */}
                    <rect x="25" y="45" width="50" height="36" rx="4" fill="#1c2331" stroke="#e6d3ba" strokeWidth="2" />

                    {/* Front maroon lens bump / base */}
                    <rect x="35" y="55" width="30" height="16" rx="2" fill="#8b261a" stroke="#e6d3ba" strokeWidth="1" />

                    {/* Extended lens (sticking out to the left) */}
                    <path d="M 25 55 L 12 50 L 12 76 L 25 71 Z" fill="#1c2331" stroke="#e6d3ba" strokeWidth="2" />
                    <ellipse cx="12" cy="63" rx="4" ry="13" fill="#3a1e12" stroke="#e6d3ba" strokeWidth="2" />

                    {/* Top Film Reels */}
                    {/* Back Reel */}
                    <circle cx="45" cy="35" r="12" fill="#1c2331" stroke="#e6d3ba" strokeWidth="2" />
                    <circle cx="45" cy="35" r="4" fill="#e6d3ba" />
                    <line x1="45" y1="23" x2="45" y2="47" stroke="#e6d3ba" strokeWidth="1.5" />
                    <line x1="33" y1="35" x2="57" y2="35" stroke="#e6d3ba" strokeWidth="1.5" />

                    {/* Front Reel (slightly larger, overlapping) */}
                    <circle cx="65" cy="30" r="16" fill="#1c2331" stroke="#e6d3ba" strokeWidth="2" />
                    <circle cx="65" cy="30" r="5" fill="#e6d3ba" />
                    <line x1="65" y1="14" x2="65" y2="46" stroke="#e6d3ba" strokeWidth="2" />
                    <line x1="49" y1="30" x2="81" y2="30" stroke="#e6d3ba" strokeWidth="2" />
                    <line x1="53.7" y1="18.7" x2="76.3" y2="41.3" stroke="#e6d3ba" strokeWidth="2" />
                    <line x1="53.7" y1="41.3" x2="76.3" y2="18.7" stroke="#e6d3ba" strokeWidth="2" />

                    {/* Little red recording light */}
                    <circle cx="70" cy="52" r="3" fill="#8b261a" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}
