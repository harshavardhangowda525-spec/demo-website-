# IRON PULSE — development handoff

Run `npm install`, then `npm run dev`. Build with `npm run build`. Requires Node 20.9+.

Implemented: Next.js App Router, TypeScript, responsive dark/orange design, R3F interactive procedural dumbbell, equipment selection, GSAP pinned scroll-to-video currentTime binding, zone gallery, editable membership plans, trainer placeholders, review carousel, validated enquiry route with optional server-only webhook forwarding.

Status: initial implementation, NOT production complete. Dependency installation was blocked by environment network policy. Build, browser, mobile, WebGL, video seek and accessibility checks have not been run.

## Assets and configuration
- Place a licensed video at `public/gym-tour.mp4`. No video is included: the current section shows a poster, not a completed cinematic tour. Encode H.264 yuv420p with frequent keyframes and fast-start for seeking. Suggested ffmpeg flags: `-c:v libx264 -crf 22 -g 12 -keyint_min 12 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart -an`.
- Unsplash remote photography is illustrative. Verify applicable license and image subjects; download and optimize approved imagery before production. No trainer or member endorsement is claimed.
- Procedural 3D models are original demo geometry. Non-dumbbell equipment is simplified placeholder geometry and needs distinct professionally modelled assets.
- Edit membership values and content in app/page.tsx. Trainer names and testimonials are fictional.
- Configure ENQUIRY_WEBHOOK_URL and optionally ENQUIRY_WEBHOOK_TOKEN on the server. Without a webhook the API explicitly reports validation only: no data is saved or sent.
- Add verified gym address, map embed, WhatsApp number, trainer experience/social links and consent language before launch.

## Remaining requirements
Real licensed cinematic video, sequential scroll text, metadata/seek readiness and error handling, mobile video fallback, reduced-motion static media behavior, scroll-linked 3D camera transitions, distinct equipment models, loading and WebGL error fallbacks, transformation comparison slider, trainer social links/experience, WhatsApp/map, Lenis integration, Tailwind setup, hero pointer/scroll movement, particles, optimization and testing. No Lighthouse score is claimed.
