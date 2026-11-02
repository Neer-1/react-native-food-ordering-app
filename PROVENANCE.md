# Publication preparation update - 2026-11-02

Candidate A16-20261102-01 reuses all 112 candidate05 files. Only documentation and .gitignore were changed; application logic, asset bytes, package.json, package-lock.json, Expo configuration, compatibility adapters and tests remain byte-identical. No dependency update or new artwork was introduced.

The owner reports the original submission was tested during coursework and graded. This is distinct from the maintained candidate: recent emulator attempts did not establish Android boot and no fresh app/device result is claimed. The owner has explicitly removed further emulator testing as a source-publication prerequisite. Earlier runtime-blocked statements below describe historical scope. Individual ownership and university permission recorded below apply to A16, independently of other projects.

This release is source-only. Existing replacement-artwork provenance and dependency notices are retained; native binary distribution obligations remain outside this release. No project license has been selected or added.

## Preserved historical provenance

# Provenance

Public author: **Neer-1**. The author confirms individual ownership of the original Mobile Technologies Question 2 application, no collaborators, and university permission to publish their coursework-derived code. Publication itself is not yet authorized. Code license undecided; no LICENSE file is supplied.

The application was recovered from the original coursework archive. It is recovered application source with later modifications, not a claim of an unchanged original submission. Submitted reports, question papers, marks, recordings, Question 1 work and recovery evidence are excluded.

Original coursework supplied the UI, menu data, styling and initial Expo configuration. Prior remediation replaced password/account simulation with a local demo alias, synthetic address and legacy-key removal, labelled checkout as a preview, added helper tests, rejected malformed saved-cart rows, discarded serialized image fields and added platform-specific gesture initialization. Dependency declarations were aligned to the SDK 52 map and a diagnostic lockfile generated. The inherited 0BSD declaration was removed; UNLICENSED does not grant an open-source license.

The author identified all original images/icons as third-party assets with unavailable license records. Nine carried Adobe Stock credits; the other 46 had unknown rights. All 55 raster images in this snapshot are new Codex-assisted geometric illustrations, generated locally with Pillow from primitives and filename-based categories, without reading or tracing the prior images. tools/generate_assets.py and tools/asset-plan.json reproduce the process. Old hashes identify replaced files only; no old artwork or embedded credit metadata is included.

Codex assisted later safeguards, tests, asset generation, dependency analysis and documentation. Ownership confirmation does not eliminate third-party obligations: React Native, Expo, navigation, UI and font dependencies retain their own licenses. Project source does not vendor their implementation or font files. Ionicons upstream is MIT-licensed; retain its notices when shipping glyph/font copies. A complete native distribution notice review remains pending, including automatically bundled font sets.

No identified third-party raster artwork remains in the candidate. This is not an exhaustive legal determination of all inherited source snippets or a grant of rights to the original coursework images.

Authorized dependency follow-up: direct SDK52 expo-asset/expo-font declarations make the asset plugin resolvable at the project root. A scoped PostCSS 8.5.32 override passed API/Expo transformer checks and Android JavaScript export. This is later Codex-assisted remediation, not original coursework. The updated lockfile records the tested tree. No other package versions changed; three Expo packages moved from nested to root resolution.

Current targeted changes: Codex-assisted serialized cart persistence, durable state updates, explicit retry/reset error handling, aggregate-total validation, and nine synthetic persistence tests. Static menu image handles are regenerated from local source rather than cached. Specific Ionicons imports remove 18 unused font sets from the exported graph; upstream and wrapper MIT notices are included. This does not license the project code.

Historical candidate04 preparation explicitly incorporates the tested dependency lock and guarded Expo CLI0.22.28 namespace adapter. The one-line change is third-party dependency compatibility work, not original coursework or an upstream Expo fix. Codex-assisted verification tools and benign extraction regression are included. Reproduction evidence: fresh install, pre-patch failure/post-patch success, config/tree/export and23 audit entries with0critical. No native/device claim. Existing candidates preserved.

Candidate05: configuration C was reproduced from its exact experimental lock using npm ci --ignore-scripts. Only the scoped xmldom0.8.15/image-size2.0.4 changes were added to candidate04's dependency configuration (obsolete queue dependency removed). Expo52.0.49, RN0.76.9, PostCSS8.5.32 and tar7.5.22 remain. Codex-assisted Metro import/path adaptation is not original coursework or an upstream patch. Its exact tested output is unchanged; guard tooling now rejects versions/hashes with explicit exceptions, supports idempotence and verifies the patched result. Both guards and the clean setup are included. Synthetic XML/image/toolchain tests and nine safe fixture files were created for this validation. No dependency implementation or font binary is vendored.

Fresh evidence: 26 helper tests, XML8, image10, all55 dimensions, archive/plist/CLI, peer tree, config and Android JavaScript export pass. Audit:0critical/0high/16moderate/4low. All assets retain prior documented provenance; no new third-party artwork. Native distribution notices and physical-device behavior still require review. No physical device/native execution has occurred; no publication approval is implied.
