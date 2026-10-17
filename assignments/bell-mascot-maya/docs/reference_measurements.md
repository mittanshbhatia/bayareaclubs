# Reference measurements

Source: `sourceimages/reference_original_front_and_side.png` (1900 x 1544; front figure left, side figure
right). All pixel values are in that original image unless noted. Crops: front `(60, 0, 892, 1544)`,
side `(870, 0, 1640, 1544)`.

## Landmarks

| Landmark                  | Front (px y) | Side (px y) | Notes                                            |
| ------------------------- | ------------ | ----------- | ------------------------------------------------ |
| Ground (lowest rim point) | 1525         | 1503        | aligned to world Y = 0                           |
| Top of blue cap           | 323          | 338         | aligned to world Y = 12.0                        |
| Top of handle             | 5            | 84          | front 15.2, side 14.6 units; reconciled to 14.85 |
| Eye centre                | ~675         | ~690        | 8.49 / 8.37 units; reconciled to 8.43            |
| Brow                      | 530-640      | n/a         | brow centre line about 8.95-9.75 units           |
| Teeth patches             | 862-960      | n/a         | about 5.65-6.6 units                             |
| Base band top             | ~1360        | ~1380       | about 1.3-1.6 units; used 1.5                    |

Mascot centre line: front x = 476 (symmetric crop, offset 0); side x = 1199 (offset applied in script).
Face points to +Z.

## Scale

Body height 12 units maps to 1202 px (front) and 1165 px (side):

- front: 0.009983 units per px
- side: 0.010300 units per px (3.2 percent larger, camera perspective)

## Silhouette tables (units, measured with arms removed)

Rows are heights above the ground. Front half-width reads the front view; front/back depth reads the side view
(face is +Z). Values feed `HALF_WIDTH_X`, `FRONT_Z`, `BACK_Z` in the script. Examples measured at the same
height in both drawings:

| Height | front half-width | side front z | side back z |
| ------ | ---------------- | ------------ | ----------- |
| 2.0    | 2.85             | 3.02         | 3.03        |
| 3.5    | 2.59             | 2.76         | 2.85        |
| 8.0    | 2.72             | 2.48         | 2.78        |
| 9.0    | 2.35             | 2.26         | 2.73        |
| 10.5   | 1.90             | 1.88         | 2.42        |

Where an arm or fist covered the silhouette (heights 4-7 in the front view, 4.5-6.5 in the side view) the body
edge was interpolated.

## Colours (sRGB, sampled from the photo)

Navy body (22, 42, 92), sky-blue stripes and rim (122, 170, 190), olive handle (84, 74, 46), tan hands
(198, 164, 110), black brows (24, 24, 26), white teeth and eyes (240, 240, 236).

## Offline comparison result

Overlap of the model silhouette (all character parts) with each drawing at these landmarks:
front 93.9 percent, side 89.5 percent. Differences are mainly the handle's rounded ends, the sleeve shoulders
and the lower face. See `docs/offline_checks/silhouette_overlay_front.png` and `..._side.png`.
