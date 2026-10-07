# Anjora Lighting

Premium React website for Anjora Lighting, positioned as an architectural lighting consultancy.

## Stack

- React 19 + strict TypeScript
- Vite
- Tailwind CSS 4
- GSAP, ScrollTrigger and `@gsap/react`
- React Router

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run visual:qa
```

`visual:qa` uses the system installation of Google Chrome through Playwright Core and saves review captures to `/tmp/anjora-visual-qa`.

## Enquiry Form Setup

The enquiry form submits directly from the browser through Web3Forms. To configure it:

1. Create a Web3Forms account and generate an access key for the official Anjora recipient email.
2. Copy `.env.example` to `.env.local` and set `VITE_WEB3FORMS_ACCESS_KEY` to that access key.
3. Add `VITE_WEB3FORMS_ACCESS_KEY` to the production hosting provider’s environment variables.
4. Restart the Vite development server after changing any environment variable.
5. Submit a test enquiry after deployment and confirm it reaches the configured recipient.

Never add `.env.local`, a real access key, or mailbox/SMTP credentials to Git. Vite embeds `VITE_` values in the client bundle; Web3Forms access keys are designed for this browser-side workflow.

## Content

Service, project and product content lives in `src/data`. Product photography and final catalogue specifications are deliberately marked as pending rather than represented with unrelated assets.
