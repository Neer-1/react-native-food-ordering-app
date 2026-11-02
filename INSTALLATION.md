# Setup versus historical verification

For ordinary setup and local launch, follow the short sequence in README.md: install with lifecycle scripts disabled, verify, apply both adapters, verify, then start Expo locally. The extended procedure below documents the historical regression/export checks; it is not necessary to repeat the entire sequence merely to read or publish this coursework. No commands below were executed during the 2026-11-02 publication preparation. Preserve the SDK52 baseline and do not assume current Expo Go compatibility.

# Explicit clean installation and guarded adapters

Tested baseline: Windows, Node24.14.0/npm11.9.0, Python3.12.3. Node/npm install the declared dependencies; Python3 standard library runs the included guards/adapter. Pillow is optional and needed only to regenerate illustrations. Do not regenerate reviewed assets as part of setup. No patch-package or manual node_modules editing is needed.

The lock pins Expo52.0.49, React18.3.1, RN0.76.9, CLI0.22.28, PostCSS8.5.32, tar7.5.22, Metro0.81.5, scoped xmldom0.8.15 and image-size2.0.4. Read SECURITY_REVIEW.md before executing development tooling. This is not an assertion of current Expo Go compatibility.

From repository root (use a disposable copy for verification):

```powershell
npm ci --ignore-scripts --no-audit --no-fund
python -B tools/verify_dependencies.py .
python -B tools/apply_adapter.py .
python -B tools/apply_metro_adapter.py .
python -B tools/verify_dependencies.py .
python -B tests/adapterGuards.py . ../foodies-guard-fixtures
node tests/expoExtraction.cjs . ../foodies-extraction-fixtures
node tests/xmlRegression.cjs .
node tests/imageRegression.cjs . tests/fixtures
node tests/toolchainRegression.cjs . ../foodies-plist-fixtures tests/fixtures/tile.png
npm ls --all
node --test tests/cart.test.cjs tests/cartStorage.test.cjs tests/cartPersistence.test.cjs tests/demoProfile.test.cjs
$env:EXPO_OFFLINE='1'
$env:EXPO_NO_TELEMETRY='1'
$env:CI='1'
node node_modules/expo/bin/cli config --json
node node_modules/expo/bin/cli export --platform android --no-bytecode --max-workers 2 --output-dir ../foodies-export --dump-assetmap
```

Use a new empty fixture directory each run; the regression test deliberately refuses existing extraction destinations. The test creates two small harmless local text files, checks direct tar and Expo's actual extraction wrapper, and exercises the cache API. It uses Node built-ins plus locked dependencies. No malicious archive or unsafe extraction option. Export does not start a listening development server and is not a device/native/Hermes test. A fresh `npm audit --json` requires registry access and remains nonzero while findings persist.

The exact one-line diff is patches/expo-cli-0.22.28-tar-adapter.patch. The explicit Python adapter requires CLI0.22.28, checks pristine/patched SHA256 and refuses drift; it is idempotent. verify_dependencies.py additionally pins this reviewed lockfile and installed versions. Hash guards verify expected artifacts, not the security of every dependency. npm ci validates package integrity using the lockfile; no claim of independent signature validation.

Every npm ci resets node_modules, so repeat the guarded patch step afterward. Do not disable the guards or silently add postinstall hooks. Dependency updates require a newly reviewed lock, explicit guard updates and regression checks. No security check in tar is removed. The wrapper's source map is not rewritten; the one-line edit preserves line count but the mapped original source describes the old import.

This adapter normalizes tar's namespace for Expo's existing default.extract call. It does not replace archive extraction behavior. The upstream MIT notice is in THIRD_PARTY_NOTICES.md; project code license remains undecided. No LICENSE file.

## Metro compatibility adapter and regression coverage

patches/metro-0.81.5-image-size-adapter.patch replaces the callable CommonJS import with imageSize's named export and reads filename inputs into buffers. Existing buffers pass through. tools/apply_metro_adapter.py requires Metro0.81.5 plus exact original/result SHA-256 hashes; repeated application is idempotent. Both adapters reject drift even under Python -O. tests/adapterGuards.py creates four isolated wrong-version/hash cases and checks rejection without source writes. Its output directory must be absent. Do not weaken guards when packages change.

The Metro change does not alter image-size parsing or security checks. Its upstream MIT notice is retained. Neither adapter's source map is regenerated; debugging against mapped original source can show the old import. Only targeted generated JavaScript is changed. These are maintained local compatibility adapters, not upstream fixes.

XML coverage has eight assertion groups plus bounded malformed-input observations. With xmldom0.8.15, CRLF text becomes LF (line\r\nnext -> line\nnext); this was verified and is expected normalization, not byte-preserving XML. Image coverage has ten groups spanning PNG/JPEG/GIF/BMP/SVG, scales, empty/truncated input and actual Metro filename and buffer paths. toolchainRegression also validates 55 app image dimensions, actual Expo plist-provider roundtrip and image-size CLI. The nine tests/fixtures files are newly generated synthetic primitives and invalid empty/truncated fixtures; they contain no original coursework artwork.

Audit reproduction (network required): npm audit --json --ignore-scripts. Exit 1 is expected for remaining findings; preserve the report and review changes rather than suppressing them. The recorded fresh audit is security-audit.json. Guards pin the reviewed lock, while npm ci verifies downloaded package integrity; this is not independent signature verification.
