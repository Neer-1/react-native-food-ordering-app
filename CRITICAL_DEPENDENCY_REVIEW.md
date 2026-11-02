# Historical investigation (superseded for candidate05)

Current counts: 0 critical / 0 high / 16 moderate / 4 low. See SECURITY_REVIEW.md and security-audit.json. Earlier unresolved/proposed-install statements below record prior stages, not current setup instructions. high-findings.json is historical evidence.

# Historical investigation and current disposition

Candidate04 now includes the authorized, successfully reproduced tar7.5.22 graph plus guarded CLI adapter. The original override alone FAILED; the adapter corrects only import interop. All "proposed/not applied" statements below are historical. Follow INSTALLATION.md for the actual procedure. Fresh audit baseline:0critical/2high/17moderate/4low.

# Critical dependency investigation

Evidence: saved A16-20261028-02/fix-dependency-audit.json; no new whole audit or install was run for this investigation.

Installed **tar 6.2.1**, transitive through expo 52.0.49 -> @expo/cli 0.22.28 -> tar (^6.2.1), and @expo/cli -> cacache 18.0.4 -> tar (^6.1.11). npm places Expo under production dependencies, but this particular chain serves development/download/cache tooling; application code does not import tar. Do not equate npm dependency classification with execution in the mobile app.

Critical advisory **GHSA-23hp-3jrh-7fpw / CVE-2026-59873**, decompression/parse denial of service: affected <=7.5.18, patched 7.5.19. GitHub/npm label Critical, while the saved CVSS v3 score is 7.5 (availability impact); report this discrepancy explicitly. Resource exhaustion requires feeding a crafted archive to a tar extraction/parser workflow. The app has no archive-upload/extraction feature. Expo's downloadAppAsync calls utils/tar.extractAsync; on Windows that uses tar.extract({file,cwd}), and on other platforms it is fallback after system tar fails. A compromised/untrusted downloaded archive could therefore affect developer CPU/disk. Offline JavaScript export is not evidence of archive safety. No exploit fixture was run.

Primary advisory: https://github.com/advisories/GHSA-23hp-3jrh-7fpw . Other saved tar advisories extend through <=7.5.20, so installing only 7.5.19 would leave other recorded issues.

Smallest proposed experiment: exact **tar 7.5.22**, scoped to @expo/cli and cacache, preserving Expo 52/RN 0.76.9 and the existing PostCSS override:

```json
{
  "overrides": {
    "@expo/metro-config": { "postcss": "8.5.32" },
    "@expo/cli": { "tar": "7.5.22" },
    "cacache": { "tar": "7.5.22" }
  }
}
```

This crosses tar's major version and parent ranges; compatibility is **not yet proven**. No patched 6.x release is established. Tar 7 provides CommonJS and requires Node >=18 (local Node24 qualifies). The 7.x changelog changes chmod defaults and stream/interfaces, so preserving method names alone is insufficient. Source inspection shows Expo's extract(file,cwd) API is a plausible candidate, not a guarantee. Registry license is BlueOak-1.0.0 for this proposed tooling dependency; do not relabel it MIT. Sources: https://registry.npmjs.org/tar/7.5.22 ; https://github.com/isaacs/node-tar/blob/main/CHANGELOG.md .

Approval required before download/install. In a new disposable copy only: apply those two overrides; npm install --ignore-scripts --no-fund --no-audit; inspect lock diff and npm ls; fresh audit; benign small archive round-trip through the installed tar and Expo wrapper (no traversal/bomb payload); check extraction contents/modes and no outside writes; offline Expo export. Adopt only after compatibility checks. No audit fix --force, major Expo migration or advisory suppression.

Other 24 current affected package entries remain unresolved; this proposal targets tar and its propagated tooling findings, not blanket security clearance. Development download/archive workflows should remain unused until remediation is validated. No new dependency declaration or lockfile change has been applied to this candidate.
