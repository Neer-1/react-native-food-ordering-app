# Historical dependency-risk disclosure

The audit below is dated 2026-10-29 and was not refreshed during the 2026-11-02 static publication pass. No dependency changes, registry access or security-clearance claim are made. Preserve the lock and guarded adapters for reproducibility. Runtime validation is no longer a prerequisite for this academic source release; this does not remove known risks or authorize production deployment.

# Candidate05 security assessment - 2026-10-29

Fresh locked configuration C: **0 critical, 0 high, 16 moderate, 4 low** (20 affected package entries, three underlying advisory identifiers). npm audit exited 1 because findings remain. This is not a security clearance. Exact installed versions, propagation edges, dependency paths, affected ranges and npm fix suggestions are in security-audit.json.

| Underlying finding | Exposure and dependency path | Remediation assessment |
| --- | --- | --- |
| decode-uri-component 0.2.2, moderate, [GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr) | React Navigation native/core -> query-string 7.1.3 -> decoder. Potential shipped JavaScript parser; malformed attacker-controlled URI input can exhaust CPU. No configured external linking input was identified in this app. | Advisory fixes begin at 0.5.0, beyond parent's ^0.2.2 range. Navigation major upgrades are suggested by npm. Neither a scoped override nor migration is compatibility-validated here. Do not enable untrusted deep-link ingress during controlled runtime tests. |
| deepmerge 4.3.1, low, [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) | Expo -> @expo/config -> deepmerge. Untrusted merge input can poison returned object prototypes. Build/config tooling exposure; separate Paper 3.x copy is not this reported node. | Advisory lists no patched version. Use only reviewed local configuration; no speculative downgrade or override. |
| uuid 8.3.2 and 7.0.3, moderate, [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) | Expo CLI -> rudder-sdk-node/bunyan -> uuid; Expo config-plugins -> xcode -> uuid. Supplied-buffer v3/v5/v6 bounds issue. No app call identified; tooling call-site coverage is incomplete. | Audit affected range <11.1.1. Moving to fixed major versions requires parent/API/module compatibility work, not validated in SDK52. Telemetry was disabled for these checks. |

Reachability statements are static inferences, not exploit tests or proof of absence. npm categorizes the toolchain under production dependencies because Expo is a direct dependency; this does not mean each config/CLI package executes on a phone. React Navigation is application runtime code. The JSON records each of the 20 propagated package entries separately. Expo 51.0.39 downgrade and new-major Navigation/Expo suggestions from audit are not accepted as compatible automatic fixes.

The xmldom and image-size high findings and tar critical finding are absent from this fresh audit. Scoped upgrades and both adapters passed clean-install checks; that does not prove every possible parser input safe. No warning was suppressed and no lifecycle script or audit fix was run. npm still emits deprecation warnings for inherited dependencies (including glob and uuid); unsupported dependencies remain maintenance risk.

For a separately approved synthetic, local runtime session, no demonstrated reachable remaining issue currently requires another broad dependency experiment first. This historical assessment originally gated publication on runtime outcomes. The owner has since approved academic source preparation without further runtime testing; known dependency risks remain disclosed, and production suitability is not established. Keep configuration and assets trusted and do not introduce external data, URLs, payments or accounts. Future dependency changes must repeat guards, parser/asset/extraction tests and audit.

Sources: fresh npm audit and exact lock; public decoder and deepmerge advisories inspected 2026-10-29. UUID details are from the fresh registry audit (the advisory webpage was unavailable during this check).
