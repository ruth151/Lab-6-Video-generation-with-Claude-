# How a Matrix Transforms 2D Space

**Takeaway sentence:** A 2×2 matrix is just a recipe that says where the two basis vectors land, and every other point in the plane moves along with them.

**Style:** 3Blue1Brown-like. Dark navy background, a faint grid, î in green, ĵ in red, yellow for the highlighted point. Calm pace, a question first, then the visual answer. Narration is short, one idea per sentence.

**Stack:** Remotion (one file per scene in `src/scenes/`), Kokoro narration (`af_heart`), ffmpeg.

**Total length:** about 95–100 s (about 250 words of narration at roughly 2.5 words per second, plus short pauses). Final scene lengths come from the audio.

---

## Scene 1: Hook, the game character (~14 s)
**File:** `src/scenes/Scene1Hook.tsx`

**Visual:** A tiny pixel-art spaceship (drawn in SVG) flies over the grid. The player presses "rotate" and the ship turns. Then the camera zooms: the whole grid rotates, not just the ship.

**Narration:**
> Ever wonder what happens when a game character turns? The computer has to move thousands of points at once. So how does it do that so fast? It all comes down to a tiny grid of four numbers.

---

## Scene 2: The grid and two special arrows (~13 s)
**File:** `src/scenes/Scene2Basis.tsx`

**Visual:** A clean 2D grid. Draw î = (1, 0) in green and ĵ = (0, 1) in red. A yellow point at (3, 2) with dashed lines: "3 steps along î, 2 steps along ĵ".

**Narration:**
> Here's a plane. Every point in it is built from just two arrows. One step right: we call that i-hat. One step up: that's j-hat. So the point three, two? It just means three i-hats, plus two j-hats.

---

## Scene 3: A transformation keeps the grid lines straight (~13 s)
**File:** `src/scenes/Scene3Transform.tsx`

**Visual:** The grid smoothly shears (matrix interpolated from identity to [[1, 1], [0, 1]]). Grid lines stay straight and evenly spaced, origin stays fixed. The yellow point rides along.

**Narration:**
> Now let's move the whole plane. A linear transformation follows two rules. The origin stays put. And grid lines stay straight and evenly spaced. Watch the yellow point. It rides along with the grid.

---

## Scene 4: The key insight (~17 s)
**File:** `src/scenes/Scene4Columns.tsx`

**Visual:** After the shear, highlight where î and ĵ landed: î at (1, 0), ĵ at (1, 1). Write the matrix with the columns coloured green and red, matching the arrows. The yellow point is now 3·(new î) + 2·(new ĵ), shown as arrow addition landing at (5, 2).

**Narration:**
> Here's the secret. We only need to track where i-hat and j-hat land. The first column of the matrix says where i-hat lands. The second column says where j-hat lands. And the yellow point? Still three i-hats plus two j-hats. So it lands at five, two.

---

## Scene 5: Game examples (~16 s)
**File:** `src/scenes/Scene5Examples.tsx`

**Visual:** Four panels, one per matrix, each applied to a small pixel ship or sprite:
1. **Rotation** [[cos, −sin], [sin, cos]]: a ship turns, "character turning / aiming".
2. **Scale** [[2, 0], [0, 2]]: a power-up mushroom grows, "grow / zoom camera".
3. **Flip** [[−1, 0], [0, 1]]: a character sprite mirrors, "facing left or right".
4. **Shear** [[1, 0.5], [0, 1]]: a tree sways, "wind effect on grass and trees".

**Narration:**
> Change the four numbers, and you get a different effect. A rotation turns your character. Scaling makes a power-up grow. A flip makes a sprite face the other way. And a shear? That's grass swaying in the wind. Same idea, different columns.

---

## Scene 6: The determinant, area change (~13 s)
**File:** `src/scenes/Scene6Determinant.tsx`

**Visual:** The unit square (î, ĵ) turns into a parallelogram. Show its area as the number "det = 2" on a stretch matrix. Then squash everything onto a line: area 0, "det = 0", the grid collapses.

**Narration:**
> One more number is worth knowing: the determinant. It tells you how much the area changes. Double the area? The determinant is two. Squash the plane flat onto a line? It's zero, and you can never undo that.

---

## Scene 7: Wrap-up (~10 s)
**File:** `src/scenes/Scene7Outro.tsx`

**Visual:** The matrix [[a, b], [c, d]] with the columns coloured green and red, next to the grid in a final pose. Text: "A matrix = where î and ĵ land".

**Narration:**
> So a matrix isn't just a box of numbers. It's a recipe. Where do the two basis arrows land? Once you know that, everything else follows.

---

## Production notes
- One narration WAV per scene (`public/audio/scene1.wav`, …) so scenes can be rebuilt independently. Set each scene's length from its audio duration.
- Shared code in `src/lib/`: `Grid.tsx` (draws the transformed grid for a given matrix) and `matrix.ts` (apply a matrix and interpolate it from the identity).
- Pixel art is drawn in SVG, with no generated images.
- Build order: Scene 2, Scene 3, Scene 4 (the core), then 1, 5, 6, 7.
- Renders: `out/render-01.mp4`, `render-02.mp4`, and so on. Never overwrite.
