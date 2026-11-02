# Foodies - React Native food-ordering coursework

A university Mobile Technologies application by **Neer-1**, prepared for source publication with later Codex-assisted maintenance. Browse a sample menu, filter by category, dietary preference, price or ingredient, view item details, manage a persistent cart and try a simulated checkout.

The owner confirms individual authorship, no collaborators and university permission to publish. The original application was submitted, tested during coursework and graded by the university, as reported by the owner. This maintained candidate includes subsequent changes and is not the unchanged original submission.

## Technology

React Native 0.76.9, React 18.3.1 and Expo SDK 52 (lock resolves Expo 52.0.49), React Navigation, AsyncStorage, React Native Paper and Ionicons. Versions describe the preserved reviewed baseline, not current platform-support guarantees. Guarded local compatibility adapters for Expo CLI and Metro are included and required by this lock.

## Setup and run

Prerequisites: Node.js/npm and Python 3. The historical preparation environment used Node 24.14.0, npm 11.9.0 and Python 3.12.3. See [INSTALLATION.md](INSTALLATION.md) for the complete historical verification procedure and adapter details.

From the repository root:

```powershell
npm ci --ignore-scripts --no-audit --no-fund
python -B tools/verify_dependencies.py .
python -B tools/apply_adapter.py .
python -B tools/apply_metro_adapter.py .
python -B tools/verify_dependencies.py .
$env:EXPO_NO_TELEMETRY='1'
npm start -- --localhost
```

Installation downloads the locked dependencies; it was not rerun during this release preparation. Python uses the standard library for adapters. Pillow is needed only to regenerate artwork, which is unnecessary for setup. Reapply both adapters after each npm ci; do not bypass their version/hash checks.

Use an Expo SDK 52-compatible client or development build. Do not assume the latest Expo Go supports this preserved SDK. Localhost mode is intended for a local development workflow; a physical phone requires a reachable local-network development-server address. No tunnel or hosted service is required. Android/iOS runtime setup is separate from this source repository. Web support is incomplete despite the inherited web script.

## Demo boundaries

Profiles use fictional aliases and example.invalid addresses, not passwords or real authentication. Local storage is not secure account storage. Logout clears the session/cart while retaining the demo alias. Checkout is a timed preview with no order submission, payment, stock update or backend. Prices are sample rupee values without tax/delivery calculation. Dietary tags are illustrative, not allergy guarantees. Profile avatar/history/favourites/settings are placeholders.

## Validation and limitations

- **Coursework:** the owner reports that the original submission was tested and graded. This is not fresh testing of the maintained candidate.
- **Historical candidate05 checks (2026-10-29):** 26 helper tests, targeted parser/adapter checks, dependency/config checks and Android JavaScript offline export passed. See [VALIDATION.md](VALIDATION.md).
- **Recent emulator attempts:** Android boot completion could not be established; guest-shell queries stalled. No fresh candidate device/app test pass is claimed. This environment limitation does not establish an application defect.
- **This preparation:** lightweight static integrity, metadata, privacy and repository-hygiene checks only. No installs, emulator, ADB, application execution or export rerun.
- Rapid cart interactions, interrupted persistence, error recovery, complete navigation and native behavior remain unverified on the maintained candidate. Restored cart items use generic icons and menu catalogues remain duplicated.
- The recorded 2026-10-29 dependency audit reported 16 moderate and 4 low affected entries, with no high/critical findings in that snapshot. It is historical, not a fresh audit or security clearance. See [SECURITY_REVIEW.md](SECURITY_REVIEW.md).

Further emulator/device testing is not a requirement for this academic source release under the owner's current publication scope. The project is not represented as production-ready or production-secure.

## Assets, authorship and rights

All 55 original raster images with unavailable redistribution rights were replaced with locally generated geometric illustrations; original artwork is excluded. See [ASSETS.md](ASSETS.md), ASSET_REPLACEMENTS.json and [PROVENANCE.md](PROVENANCE.md). Existing dependency notices are retained in THIRD_PARTY_NOTICES.md. No font binary, build export or screenshot is included. Native/bundled-distribution notices require a separate review if distributing an APK/IPA or other built package.

The project remains private:true and UNLICENSED in package.json. No LICENSE file or open-source license grant is supplied; public source visibility alone does not grant reuse rights. No GitHub repository has been modified by this preparation.
