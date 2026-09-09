# Changelog

## [Unreleased]

### Security
- bump Next.js to 16.3.3 to patch GHSA-2xp9-vwfh-vxw4, a CRITICAL unauthenticated RCE in the Image Optimization API triggered by AVIF processing (heap buffer overflow via libheif/sharp), which this app was directly exposed to since `image/avif` is enabled in `next.config.ts`.
- bump Next.js to 16.2.6 (CVE-2026-44573/44574/44575/44578/45109 — middleware auth bypass + DoS)
