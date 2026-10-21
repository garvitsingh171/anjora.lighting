# Image audit — October 2026

The complete file inventory, pixel dimensions, file sizes, and SHA-256 hashes are in [image-audit.csv](./image-audit.csv). The audit covers Home, services, project cards and details, the Blog, About, branding, and the current product pages. Product pages now use locally stored illustrative photographs, with all catalogue models still pending client confirmation.

## Findings

- **90 raster assets remain:** 56 project assets, 17 Blog covers, 7 service photographs, 8 product illustrations, 1 founder portrait, and 1 official logo.
- **40 have a longest side below 800px.** Most are photographs from Anjora's published project archive. They can look soft when enlarged in the Projects grid or a detail hero. They were preserved because replacing them with unrelated stock would misrepresent the work.
- The founder portrait is **279 × 278**. It is legitimate but cannot render sharply at the current large portrait size. Request a higher-resolution original from the client.
- The two former 600 × 400 service illustrations have been replaced with 1600-pixel-wide licensed photographs. The off-brand stage control board photograph was also replaced with an architectural wall dimmer image.
- The **17 Blog covers are square WebP files** and depict their article subjects. The lighting-design-cost cover was replaced with a 1200 × 1200 photograph of a plan review; the other 16 are 1254 × 1254. Some are visibly staged illustrations rather than documentary photographs. They remain labelled as article covers, not Anjora projects.
- The former hero image was a 1600 × 800 architectural render. The hero now uses the verified City Palace project photograph from Anjora's archive, **1600 × 1067**. A larger original would be useful for high-density desktop displays.
- No visible watermark was found in the contact-sheet review. All rendered image slots use `object-fit: cover` or keep intrinsic aspect ratio.

## Provenance and corrections

The service and product photographs were downloaded from individual free-photo pages on Unsplash as local WebP files and recorded with the photographer, license, dimensions, use, and crop in `src/data/imageManifest.ts`. The [Unsplash License](https://unsplash.com/license) permits commercial use. Each service image is visibly labelled illustrative photography. One Blog cover uses a separately recorded Pexels photograph under the [Pexels License](https://www.pexels.com/license/).

The published project archive remains factual. The Neo card now uses a photo of the project instead of a logo. Ohana's card now uses its 1600-pixel project photograph. Two Boozup gallery entries were removed from the displayed data: one was an exact duplicate of Dyore's photo, and the other visibly carried Rosado signage. Rosado's lower-resolution duplicate terrace image was removed in favour of the 1600-pixel version.

## Files removed

| File | Reason |
| --- | --- |
| `src/assets/images/hero-exterior.jpg` | Superseded architectural render, unreferenced. |
| `src/assets/images/service-consultancy.png` and `service-design.png` | Superseded 600-pixel illustrations, unreferenced. |
| `src/assets/images/project-city-palace.jpg`, `project-kingsman.jpg`, `project-institutions.jpg`, `project-offices.jpg` | Exact duplicate client photographs retained in `src/assets/projects/`. |
| `src/assets/images/project-hotels.jpg` | Unreferenced generic interior photograph. |
| `src/assets/projects/boozup/gallery-01.png` | Exact duplicate of Dyore's project photo, misassigned to Boozup. |
| `src/assets/projects/boozup/gallery-03.jpg` | Misassigned image visibly showing Rosado signage. |
| `src/assets/projects/rosado/gallery-01.jpeg` | Lower-resolution duplicate of `gallery-02.jpg`. |

All removed files were checked for source references before deletion. The project-download script was updated so it does not restore the misassigned or duplicate project photos. Genuine low-resolution client images with no better verified replacement remain in the repository.

## Client originals needed

Request the high-resolution founder portrait and project files for Kingsman, Office 1–3, Gym Ajmer, Facade 1–3, Theatre, Neo, Boozup, Code Black, Hobs and Taters, Turmeric, and the smaller Ohana and Baramasi gallery images. The current archive images are typically **179–560px** across. They are retained as documentary project evidence until genuine originals arrive.

## 21 October 2026 refinement

Eight product concept cards now use category-relevant illustrative installations. None is a verified Anjora or manufacturer catalogue model. In particular, the Trimless Downlight photograph shows a recessed installation; Anjora should provide the actual model photograph before catalogue approval. The product UI states that the imagery and models are illustrative.

The Lighting Procurement and Lighting Audit service images were replaced, as was the stage control image for Light Management. The unused original files `service-sourcing.png`, `service-execution.png`, and `services/management.webp` were removed after reference checks. Genuine low-resolution project media was preserved.

Priority original requests include Code Black (281 × 169 cover), Hobs and Taters (266 × 176 cover), Facade 2 (209 × 209 cover), Boozup (300 × 180 cover), Gym Ajmer (391 × 302 cover), and the founder portrait (279 × 278). Dyore's two 1024 × 768 PNG gallery images total about 2.8 MiB; they remain because they document real work.
