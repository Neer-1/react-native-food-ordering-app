# Optional future runtime plan

Preserved for future development, not a requirement for the 2026-11-02 source-publication scope. The owner reports coursework testing of the original application. No fresh maintained-candidate device pass is claimed; recent emulator boot attempts remained blocked before app launch. The instructions below are a plan, not executed results.

# Android runtime validation plan - NOT EXECUTED

Prerequisites: explicit approval for a listening development server and emulator/device use; an installed Android emulator/device and official SDK52-compatible Expo Go client, or separately approved development build. Do not assume current store Expo Go supports SDK52. Obtain historical client only from the official Expo download page after download/install authorization. See https://docs.expo.dev/get-started/set-up-your-environment/ and https://expo.dev/go . No tool installation is included in this plan.

Use a disposable copy of this candidate and complete INSTALLATION.md, including both guarded adapters, before any separately authorized runtime session. Record Windows/Node/npm/Expo/client/Android versions and device model. Use a fresh test-only app storage area, no personal account or production services. Keep New Architecture configuration as recorded and verify client compatibility rather than changing it silently.

After authorization, in the disposable project PowerShell directory:

```powershell
$env:EXPO_NO_TELEMETRY='1'
$env:EXPO_OFFLINE='1'
& 'C:\Program Files\nodejs\node.exe' node_modules/expo/bin/cli start --localhost --port 8081
```

Launch the already installed Android emulator manually, use its SDK52 client to open exp://10.0.2.2:8081 (Android Studio emulator host-loopback convention). If that client cannot reach the host, record the error and request network scope before changing to LAN/tunnel. Do not let Expo install a client automatically. Physical-device alternative requires explicit LAN authorization; then use `start --lan --port 8081` and scan the shown QR code. No tunnel/external hosting.

Test sequence and expected outcomes:

1. Cold launch: splash/icons, Login; reject blank/invalid alias, accept Demo_User1, show example.invalid address; no password or real identity.
2. Visit Home -> each category -> MenuDetail -> add item -> Cart; visit Profile and back navigation. Filters/empty results and all images render without red screens/missing glyphs.
3. Add one item, increment twice (quantity3), remove another; verify arithmetic. Wait for successful UI update (writes are acknowledged before rendering), force-stop the app and reopen without clearing app data. Same cart and quantities must restore.
4. Rapidly increment20 times then confirm simulated checkout. No payment/order occurs. Wait for clear completion, force-stop/reopen: empty cart. Add again: quantity1, no resurrected old rows.
5. Cancel checkout/dismiss preview/navigate away; timer must not resurrect modal or clear cart. Confirm clearing only at user confirmation.
6. Rename profile, navigate away/back, logout then reopen: login required and saved cart empty, alias retained. Verify back cannot return to prior session. Record profile-refresh shortcomings rather than treating helper tests as proof.
7. Storage fault harness in a disposable copy only: temporarily wrap the AsyncStorage adapter to reject getItem/setItem, or supply malformed cartItems JSON. Do not modify real device storage. Expect visible storage error; no automatic overwrite; Retry preserves data; Reset asks confirmation and stores []; failed checkout reports failure and retains saved state. Revert the harness before packaging. Exact fake-storage behaviors already have unit coverage in cartPersistence.test.cjs; device fault UI coverage remains pending.
8. Restart after empty/missing storage; observe no phantom rows. Accessibility labels, text size, loading/error state and tap targets must be reviewed.

Stop the server with Ctrl+C. Record each actual result, screenshots with fictional data only, errors, and final process shutdown. A passed JS export is not a passed device session. No runtime command in this document has been executed.
