# The agent field

A canvas background: a routed circuit board that holds still while pulses run
its traces and finish wherever the copper stops.

**Status: parked.** [`AgentField.astro`](./AgentField.astro) is complete and
works, but no page uses it. The site ships the type-only design. This document
exists so the thinking survives the shelf, because the code is the cheap part
and the dead ends below are the expensive part.

## Switching it on

Two edits, no other files involved. The palette lives inside the component
while it is parked, so there is nothing to copy back.

```text
// src/layouts/BaseLayout.astro
import AgentField from '~/_drafts/AgentField.astro';

// inside <body>, before the content:
<AgentField intensity={background} />
<div class="relative z-10">
  ... header, main, footer ...
</div>
```

The wrapper matters: the canvas is `position: fixed` at `z-0`, so content needs
its own stacking context above it rather than relying on paint order.

Add a `background?: 'off' | 'quiet' | 'active'` prop to `BaseLayout`, defaulting
to `quiet`, and pass `background="active"` from the two home pages. `off` renders
the element and draws nothing, so the setting can change without touching markup.

If it is ever adopted for good, move the `:root` block out of the component and
into `global.css` beside the rest of the palette.

## What it does

- The board is generated once from a fixed seed and never moves. Every visitor
  sees the same layout, which makes it a brand asset rather than noise, and
  makes a visual regression something you can look at twice.
- Traces are laid by an occupancy walk: run straight until blocked, turn 45
  degrees, run again. Parallel bundles fall out of that rule rather than being
  imposed on the picture.
- A blocked run looks a little further ahead for copper and lands on it,
  recording a junction. Two thirds of traces end on another trace rather than
  in space, which is what makes it read as one network.
- Pulses run a trace with a bright head and short tail, cross junctions onto
  whatever that trace joins, and finish where the copper genuinely stops.
- A trace stays lit behind a pulse and cools over about half a minute, so the
  board carries a visible record of where the work has been.

## What was learned, mostly the hard way

Four versions were built and thrown away before this one. Each failed for a
reason worth writing down, because each looked reasonable while it was being
built.

**An arbitrary-angle graph reads as a network diagram.** Nodes and edges at
whatever angle the layout produced. Every AI company has this exact background.
It says "network", which is not the same as saying anything.

**A uniform lattice reads as graph paper.** Equal spacing in every direction
gives triangles and squares. Regularity is not the same as engineering.

**Right-angled routing reads as a schematic.** Manhattan-only geometry looks
hand-drawn. The 45 degree diagonal is the signature of every autorouter ever
written, and its absence is what kept the board looking illustrated.

**Large outlined rectangles with legs read as a child's drawing of a chip.** The
icon of a component is not a component. What makes a package look real is the
inside: a die, a pad grid, a chamfer.

**Pad arrays are the easiest thing on a board to overuse.** A grid of drilled
pads is the most eye-catching element available, so the instinct is to use lots.
Real boards have a package or two and a connector; the texture comes from the
routing. This version has two or three, deliberately.

**An agent that wanders locally looks like it is cruising, because it is.** The
first motion was a random walk. It went nowhere and meant nothing. Signals that
run a route and end at a terminal read as work being done. Nothing should ever
reverse out of a dead end: that reads as something lost.

**Motion that leaves no trace is just a moving dot.** Collection has to be
visible. The lit-and-cooling trace is the whole point of the animation.

**Brand red everywhere reads as an alarm.** It fights the wordmark. Accent is
spent on one thing only, the flare where a pulse reaches a terminal, so it
arrives as an event rather than as a wash. The pulses themselves are graphite:
on paper, the light bead you would use on a dark board is invisible, because
the equivalent of light-on-dark here is dark-on-light.

**An even field of texture is wallpaper, however good the texture.** The last
version added a focal package with copper radiating from all four sides. It is
placed right of and below the headline, because a focal point level with display
type argues with the type instead of supporting it.

## Tuning

Everything lives in `SETTINGS` at the top of the script, per intensity:

| Knob                      | What it does                                                                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pitch`                   | Gap between two parallel runs. Scaled up on small screens: it is a physical size, so a phone otherwise gets desktop routing squeezed into a fifth of the area. |
| `density`                 | Routing attempts per million square pixels. Saturates: past a point the limit is `reach`, not attempts.                                                        |
| `bundle`                  | Widest bundle, in parallel traces.                                                                                                                             |
| `pulses`                  | How many run at once.                                                                                                                                          |
| `speed`                   | Pixels per second.                                                                                                                                             |
| `traceAlpha` / `padAlpha` | How far back the board sits. Interior pages want this lower than the hero: they carry body copy across the full width.                                         |

Weight tiers (`WEIGHTS`) give power, bus and signal copper their own width and
alpha. Uniform width is what makes a board read flat.

## Verifying it

**A headless screenshot cannot show you the animation.** The per-frame delta is
clamped, so Chrome's `--virtual-time-budget` buys almost no simulated seconds:
a still taken after "30 seconds" shows about three. Stills are good for the
layout and useless for the motion.

To check behaviour, drive the built bundle against a stub DOM in Node: stub
`window`, `document`, `getComputedStyle`, `IntersectionObserver` and
`requestAnimationFrame`, import
`dist/_astro/AgentField.astro_astro_type_script_index_0_lang.*.js`, then call
the stored callback in a loop. That is how the accumulation curve, the junction
share and the ten-minute stability were measured, and how a router bug that
made stills look plausible was found: it was claiming occupancy as it walked, so
it blocked its own next step and stopped after one cell.

## Guardrails, all deliberate

- `prefers-reduced-motion` draws the board once and never starts the loop. A
  still routed board is a perfectly good outcome, which is the sign the concept
  is the right one.
- The loop stops when the tab is hidden or the field scrolls out of view.
- Device pixel ratio is capped at 2.
- The unlit board is drawn once into an offscreen canvas and blitted; a frame
  costs the pulses and the few traces still cooling.
- `aria-hidden` and `pointer-events: none`. It is decoration and must never be
  reachable, focusable or announced.
- Every colour comes from `--field-*`. None is hardcoded in the drawing code.

Measured: the board builds in under 10ms at desktop, tablet and phone sizes, and
ten simulated minutes of traffic at each runs without an exception.

## If it is ever picked up again

- **Per-page seeds.** Every page currently shows the identical board. That is
  either brand consistency or repetition, depending on taste.
- **Scroll parallax.** Translating the canvas by a fraction of the scroll offset
  would stop long pages feeling like wallpaper. Compositor-only, so it is cheap,
  but it is the kind of motion that can grate by the fifth visit.
- **The two palettes.** `--field-*` mirrors the site's oklch tokens as sRGB
  triplets by hand. If the palette moves, these have to move with it.
