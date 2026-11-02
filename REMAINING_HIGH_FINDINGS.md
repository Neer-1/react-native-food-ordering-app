# Historical investigation (superseded for candidate05)

Current counts: 0 critical / 0 high / 16 moderate / 4 low. See SECURITY_REVIEW.md and security-audit.json. Earlier unresolved/proposed-install statements below record prior stages, not current setup instructions. high-findings.json is historical evidence.

# Remaining high-severity findings ? no upgrades applied

Authoritative baseline: the fresh npm audit from the approved locked-install reproduction on2026-10-28. This candidate preserves that dependency graph. 23 affected package entries:0critical/2high/17moderate/4low. The following are static exposure assessments, not exploit tests.

## @xmldom/xmldom

Installed vulnerable instance:0.7.13 at node_modules/@xmldom/xmldom. Main tooling chain: expo -> @expo/config-plugins -> @expo/plist -> @xmldom/xmldom; @expo/plist requests ~0.7.7. Immediate parent requests and every saved advisory are listed below and in high-findings.json.

XML parsing/serialization vulnerabilities include markup injection, uncontrolled recursion and quadratic CPU/memory use. SDK52 plist tooling calls DOMParser with an errorHandler and parseFromString(xml). A16 source does not parse remote XML or expose an XML endpoint; exposure is developer/native-config tooling processing untrusted or malformed plist/XML. Local authored app configuration reduces observed reachability but does not clear the vulnerability. No malicious fixture was executed.

Fixed candidates:0.8.15 and0.9.12 are published versions outside all saved affected ranges for this0.7.13 instance. The official quadratic-attribute advisory names both fixed releases: https://github.com/advisories/GHSA-8344-3jmq-59r6 . Some earlier issues were patched in0.8.12/0.8.13, which do not address the later <=0.8.14 findings. Registry confirms0.8.15 (Node>=10,MIT). The smallest proposed experiment is an @expo/plist-scoped0.8.15 override, not a blind global0.9 upgrade. It exceeds the parent's ~0.7.7 range; DOMParser error handling, MIME/default behavior, plist round-trips and config/plugin outputs must be compared before compatibility is claimed. No compatible fix has yet been demonstrated. Requires separate install approval.

## image-size

Installed1.2.1 at node_modules/image-size. Tooling chain: expo -> @expo/metro-config -> metro -> image-size (^1.0.2). Saved advisories describe infinite-loop denial of service in JXL/HEIF and ICNS parsing. Metro processes local assets during bundle/export; app code does not import this parser or accept remote image uploads. Current55 replacement images are controlled PNG/JPEG, so the named problematic formats are not present. This is mitigation context, not a universal parser-security guarantee.

Saved affected ranges end at2.0.2;2.0.3+ is outside those recorded ranges, and published2.0.4 is the concrete proposed test version (Node>=18,MIT). Metro currently calls require('image-size') as a function and passes image data. Upstream2.x exposes named imageSize and separate file-reading APIs; a plain override would risk a callable-export failure like the tar regression. Official API documentation: https://raw.githubusercontent.com/image-size/image-size/main/Readme.md (upstream notes ongoing maintenance moved to Codeberg). Primary advisory: https://github.com/advisories/GHSA-w3rx-r6r6-pgpr .

No drop-in compatible1.x fix is established. Preferred next research is a verified compatible Metro backport/update; if absent, a narrowly scoped2.0.4 + named-export adapter experiment would need explicit approval and PNG/JPEG dimension comparisons, all Metro call-site review, and fresh export/audit. Do not perform speculative global upgrades. Keep this finding unresolved until demonstrated; no warning suppressed.

## Exact saved advisory identifiers and affected ranges


### @xmldom/xmldom

- GHSA-wh4c-j3r5-mjhp ? affected `<0.8.12`; high. https://github.com/advisories/GHSA-wh4c-j3r5-mjhp
- GHSA-2v35-w6hq-6mfw ? affected `<0.8.13`; high. https://github.com/advisories/GHSA-2v35-w6hq-6mfw
- GHSA-f6ww-3ggp-fr8h ? affected `<0.8.13`; high. https://github.com/advisories/GHSA-f6ww-3ggp-fr8h
- GHSA-x6wf-f3px-wcqx ? affected `<0.8.13`; high. https://github.com/advisories/GHSA-x6wf-f3px-wcqx
- GHSA-j759-j44w-7fr8 ? affected `<0.8.13`; high. https://github.com/advisories/GHSA-j759-j44w-7fr8
- GHSA-6gmq-8vp8-gcm6 ? affected `>=0.7.0 <=0.8.14`; moderate. https://github.com/advisories/GHSA-6gmq-8vp8-gcm6
- GHSA-w2rr-34g9-rvrj ? affected `>=0.7.0 <=0.8.13`; high. https://github.com/advisories/GHSA-w2rr-34g9-rvrj
- GHSA-4w3w-2rp5-g8jm ? affected `>=0.7.0 <=0.8.13`; high. https://github.com/advisories/GHSA-4w3w-2rp5-g8jm
- GHSA-c7q8-3ch8-vqpv ? affected `>=0.7.0 <=0.8.14`; high. https://github.com/advisories/GHSA-c7q8-3ch8-vqpv
- GHSA-27p8-2357-5qqv ? affected `>=0.7.0 <=0.8.14`; high. https://github.com/advisories/GHSA-27p8-2357-5qqv
- GHSA-6h8r-xr42-gp59 ? affected `>=0.7.0 <=0.8.14`; moderate. https://github.com/advisories/GHSA-6h8r-xr42-gp59
- GHSA-8344-3jmq-59r6 ? affected `>=0.7.0 <=0.8.14`; high. https://github.com/advisories/GHSA-8344-3jmq-59r6
- GHSA-x4fp-j954-r2f4 ? affected `>=0.7.0 <=0.8.14`; high. https://github.com/advisories/GHSA-x4fp-j954-r2f4
- GHSA-965w-775f-mr7g ? affected `>=0.7.0 <=0.8.14`; high. https://github.com/advisories/GHSA-965w-775f-mr7g
- GHSA-93r5-fhx6-vmg9 ? affected `>=0.7.0 <=0.8.14`; high. https://github.com/advisories/GHSA-93r5-fhx6-vmg9

Declared immediate parent requests: node_modules/@expo/plist ? ~0.7.7; node_modules/plist ? ^0.9.10.

### image-size

- GHSA-5p2g-fcmc-qvqq ? affected `>=1.2.0 <=2.0.2`; high. https://github.com/advisories/GHSA-5p2g-fcmc-qvqq
- GHSA-w3rx-r6r6-pgpr ? affected `>=0.6.3 <=2.0.2`; high. https://github.com/advisories/GHSA-w3rx-r6r6-pgpr

Declared immediate parent requests: node_modules/metro ? ^1.0.2.
