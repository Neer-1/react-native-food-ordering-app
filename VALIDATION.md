# Publication evidence status - 2026-11-02

The original submission was tested during coursework and graded, according to its owner. The maintained release candidate has NOT passed fresh device/emulator application validation. Recent bounded emulator attempts failed to confirm Android boot; Expo/app validation did not begin. No new app defect is inferred from that environment failure.

For this preparation, only static checks were performed; earlier checks below were reused, not rerun. Further device testing is optional follow-up for this academic source release, not a publication gate. Historical references to current/latest audits mean the dated candidate being discussed, not today's dependency status.

## Historical verification records

# Candidate05 current evidence

Clean-install configuration C passed on 2026-10-29: 896 installed entries; both adapters and four rejection guards; XML8; image10; actual Expo extraction/plist provider; all55 replacement dimensions; 26 helpers; dependency tree/peers; Expo config; Android offline no-bytecode export. CRLF normalization to LF observed. Audit 0critical/0high/16moderate/4low (exit1). No device/native validation. See INSTALLATION.md, SECURITY_REVIEW.md and RUNTIME_TEST_PLAN.md.

## Earlier evidence (historical)

# Candidate04 current validation

The packaged procedure passed a fresh offline npm ci --ignore-scripts from the existing approved cache, with no additional downloads. Both version/hash verifications passed around explicit adapter application. The included extraction-wrapper regression, npm ls --all, Expo config and Android no-bytecode export passed. All26 helper tests passed (19 cart/storage/persistence and7 demo-profile). Python tools parse; an unexpected lockfile is rejected. The lock remained unchanged.

The latest fresh network audit is the authoritative reproduction baseline:0critical/2high/17moderate/4low. Candidate package/lock are byte-identical to that reproduction; no redundant network audit was made during packaging. No native/device/server/emulator run. Earlier notes below are chronological evidence and may refer to failures superseded by this result. Use INSTALLATION.md for current instructions.

# Validation record and device plan

2026-10-28: all 55 replacement assets decoded and matched planned dimensions, no EXIF, all hashes changed; representative contact sheet visually reviewed. Expo offline config resolved successfully. Android no-bytecode export failed before bundling: required expo-asset could not be resolved at project root. No app/server/emulator was launched. Existing SDK 52 dependencies were copied to disposable staging; no lifecycle scripts or new installs were executed for that check.

Retained prior evidence: 5 cart tests, 5 persisted-cart tests and 7 demo-profile tests passed. Dependency tree previously passed npm ls --all; audit reported 26 affected packages. Tests and audit are distinct from runtime readiness.

After dependency repair, rerun offline configuration and Android export with EXPO_OFFLINE=1, EXPO_NO_TELEMETRY=1, CI=1; use installed CLI directly and --no-bytecode --max-workers 2. Keep export/cache output outside publication source. Record command, Node/Expo version, exit code and log. Test iOS separately; Android export does not establish iOS/web compatibility.

Device checks require separate authorization and an SDK-compatible test client. Use fictional aliases and disposable storage only. Record device/OS/client/build versions and actual observations:

1. Cold startup, first-run alias validation, resume, rename, logout and relaunch; verify no password or real profile is needed.
2. Login/Main/MenuDetail and Home/Cart/Profile tabs; back gestures and logout remove authenticated-looking navigation history.
3. Each category, combined filters and empty results; inspect every image layout and icon/splash rendering.
4. Add/remove/increment items, totals, rapid mutations, restart persistence and cart clearing during pending saves.
5. Missing/malformed storage and simulated read/write failures; confirm data-loss behavior and recovery messages before claiming robust storage.
6. Checkout preview dismissal, unmount/timer cancellation and confirmed clearing; no real transaction.
7. Profile placeholder controls clearly identified; no implication of order history or genuine account authentication.

None of these device checks has passed merely because helper tests or a bundle succeeds.

## Authorized follow-up results (supersedes initial export blocker)

2026-10-28: new disposable install with --ignore-scripts --no-audit --no-fund succeeded. Direct expo-asset ~11.0.5/expo-font ~13.0.4 and scoped PostCSS 8.5.32 override resolved as requested; npm ls --all exited 0. npm audit exited 1 with 25 affected packages (4 low, 15 moderate, 5 high, 1 critical). PostCSS API processing and Expo transformPostCssModule with synthetic CSS both passed. Temporary test config was removed from the disposable copy.

Offline Expo configuration and Android export (--no-bytecode --max-workers 2 --dump-assetmap) exited 0 with telemetry disabled. One Android JavaScript bundle, assetmap.json and metadata.json were generated outside publication source. This supersedes the missing-root-expo-asset failure without erasing its log. No listening server, app, emulator, native build, Hermes or iOS/web test was run. Export includes dependency-provided font assets beyond the app's explicit Ionicons imports; built-distribution attribution remains pending. Helper code did not change; prior 17 helper-test passes were retained.

## Targeted cart/font continuation

19 cart/storage unit tests passed, including nine new persistence tests covering restart, invalid/corrupt/empty storage, quantity serialization, delayed save then checkout clear, read/write failures, durable notifications and aggregate overflow. Unchanged profile suite was not rerun. Android no-bytecode export rerun specifically for modified context/UI and icon imports passed. New export font list is exactly Ionicons.ttf (previously19). No device persistence claim. No repeated installation or full audit. RUNTIME_TEST_PLAN.md supplies the gated device procedure.
