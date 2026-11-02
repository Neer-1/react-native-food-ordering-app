# Font and image disclosure review

The source candidate contains **zero .ttf/.otf/.woff files**. System text uses React Native's platform font; no custom text fontFamily is declared. The prior Android export bundled 19 dependency icon-font files because application code imported from the vector-icons barrel. All five imports now target @expo/vector-icons/Ionicons directly. Do not copy the old export to a release.

| Prior export font | Verified permission evidence / disposition |
| --- | --- |
| AntDesign.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| Entypo.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| EvilIcons.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| Feather.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| FontAwesome.ttf | Embedded upstream license URL only; complete artifact notice review not completed; excluded. Not cleared here. |
| FontAwesome5_Brands.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| FontAwesome5_Regular.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| FontAwesome5_Solid.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| FontAwesome6_Brands.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| FontAwesome6_Regular.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| FontAwesome6_Solid.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| Fontisto.ttf | Embedded MIT label/URL, but complete artifact attribution not established; excluded by narrow import. Not cleared for redistribution here. |
| Foundation.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| Ionicons.ttf | Official Ionic MIT license plus installed vector-icons MIT notices reviewed; retained via specific import. Notices included in THIRD_PARTY_NOTICES.md. |
| MaterialCommunityIcons.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| MaterialIcons.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| Octicons.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| SimpleLineIcons.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |
| Zocial.ttf | No font-specific complete license/attribution established in this review; excluded. Not cleared here. |

Font file metadata alone is not a license. The installed wrapper's MIT notice does not clear unrelated glyph sets. Ionicons' verified upstream license is MIT and the wrapper/vendored implementation also supplies MIT notices. Installed Ionicons hash: 9c7fb9071a6c28582c6b84468cbff2c7a71e02b17e3a3b4548a159938d22916b. Its embedded Version 1.0 is not a reliable upstream semantic version; no claim of byte identity with an upstream tag is made. The upstream license and installed package notices support redistribution with notices, not any grant for the coursework code.

Fallback for any icon whose permission cannot be established: replace the icon-only control with an accessible short text label using the platform default font (for example Home, Cart, Profile, Add, Remove). Do not download another icon font. Check layout/touch targets on device. No unreviewed font should be bundled simply to preserve an icon's appearance.

All 55 formerly uncleared raster images remain replaced by geometric assets drawn from primitives without tracing the old artwork. ASSET_REPLACEMENTS.json identifies each replacement; no original stock image is included. This continuation changes no image content. Prior verified replacement-image checks are retained rather than repeated. Candidate manifest binds the replacement bytes in the new snapshot.

New Android offline export passed after the import change. Its asset list contains exactly one font: Ionicons.ttf; all other 18 prior font files are absent. Export is private evidence, not a publication artifact. No font binary is in repository/.
