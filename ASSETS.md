# Asset replacement record

55 original raster assets were inventoried: 9 with Adobe Stock credits and 46 with unknown rights. None had verified redistribution permission. They remain only in preserved original/private review evidence; all 55 working-copy images were replaced.

The replacements are original geometric arrangements drawn from circles, rectangles, lines and polygons, using code rather than tracing or sampling original artwork. The original filenames were retained to preserve imports; aspect ratios were retained with maximum dimension 1024. The images are generic illustrations/placeholders, not exact product depictions. All 55 passed image decoding, planned dimensions, absence of EXIF and changed SHA-256 checks. Replacement bytes total 1,654,192.

ASSET_REPLACEMENTS.json maps each old reference/hash to its replacement hash, dimensions, size, method and verification. tools/asset-plan.json contains paths and old hashes/dimensions, not original image contents. The script needs Python and Pillow only for regeneration; Pillow is not an application dependency. Exact output bytes can vary across Pillow/JPEG encoder versions; the release manifest identifies the reviewed output.

```sh
python tools/generate_assets.py --root /path/to/disposable/output
```

Do not regenerate over the reviewed release without rechecking hashes. The application uses the bundled PNG/JPEG outputs; it does not execute the generator.

Dependency glyphs are distinct from these 55 raster assets. App source imports Ionicons from @expo/vector-icons. Official upstream license evidence: https://github.com/ionic-team/ionicons/blob/v7.1.0/LICENSE (MIT, copyright Ionic); @expo/vector-icons also includes MIT notices for Joel Arvidsson and 650 Industries. No font files are copied into this source package. Retain applicable dependency/font notices in any built distribution and verify the actual glyph versions bundled. That distribution review is pending.
