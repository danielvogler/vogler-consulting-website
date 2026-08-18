# Logo usage

Short version: use a generated file as it is, on one of the two approved
backgrounds, with room around it. Everything below is that sentence with the
edge cases filled in.

## The mark

The wordmark is `VOGLER` over `CONSULTING`, set in Inter Medium, with the period
after CONSULTING in accent red. The period is part of the mark. It is not
decoration and it is not optional.

The monogram is `VC.` in Inter Bold, same red period. Use it only where the full
wordmark would render below its minimum size.

## Clear space

Keep clear space of at least half the cap height on every side. The generated
files already include it, which is the reason to use them rather than
re-typesetting the wordmark.

## Minimum size

| Mark     | Minimum                             |
| -------- | ----------------------------------- |
| Wordmark | 120px wide on screen, 30mm in print |
| Monogram | 32px on screen, 10mm in print       |

Below the wordmark minimum, use the monogram. Below the monogram minimum, use
nothing.

## Backgrounds

Two are approved: paper `#fbf4f0` and white. On anything else, use the
transparent landscape file and check the contrast yourself.

Over a photograph, put the mark on a solid paper panel. Do not set it directly on
an image: the red period disappears against a warm background, and the mark then
reads as a typo rather than as a logo.

## Do not

- Do not retype the wordmark. Use a generated file.
- Do not change the colour of the period, or drop it.
- Do not stretch, squash, rotate or skew the mark.
- Do not add a shadow, glow, outline or gradient.
- Do not put the mark in a box that crops its clear space.
- Do not use the square logo as a profile picture. Platforms mask avatars to a
  circle and it loses its corners. There are avatar files for that.
- Do not recolour the mark to match a client's brand.

## Files

See the [catalogue](./README.md#catalogue) for which file to use where. If none of
them fits, add an entry to `ASSETS` in `scripts/brand/build.mjs` and regenerate,
rather than editing an exported file by hand: a hand-edited export is a fork of
the brand that nothing will ever update again.
