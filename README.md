# The Trust Tool

An interactive game for building instinct about **where to trust AI output** — and where a
human must stay in the loop.

Every AI task lives on a 2×2 grid:

|                       | **Average is fine**            | **Must be Precise**               |
| --------------------- | ------------------------------ | --------------------------------- |
| **Large consequences** | Verify Load-Bearing Bits | Human-in-the-Loop |
| **Small consequences** | Trust with Light Review | Verify Before You Ship |

- **x-axis:** how exact does the output need to be? (Average is fine to Must be Precise), left to right
- **y-axis:** what is the blast radius if it is wrong? (Small to Large), bottom to top

## How to use it

1. The tool opens in the Business pack. Use the Scenario pack dropdown to switch. Packs
   cover professional firms, education, and technical or industry work.
2. All 10 scenarios appear as mini cards. Tap **ⓘ** on a card to read the full scenario.
3. Drag a card to the quadrant where it belongs, or tap the card and then the quadrant.
4. **✓** = correct: the card locks in; tap the ✓ for the explanation.
   **✗** = wrong: tap the ✗ for a hint, then move the card to another quadrant.
5. Only your **first attempt** on each card counts toward the first-pass accuracy (X/10).
6. Tap **ⓘ** on any quadrant for what that trust level means, with examples and a rule
   of thumb.

The 2x2 is visible on load. The domain picker is a dropdown, not a start screen. That
keeps the exercise close to the work a partner would actually do.

## Running it

No build step, no dependencies — plain HTML/CSS/JS. Open `index.html` in a browser, or
serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Works as a static site on GitHub Pages as-is — live at
<https://trusttool.borck.education/> (the old
<https://michael-borck.github.io/trust-tool/> URL redirects there).

**Deep links:** append `?domain=<id>` to skip the picker and open a pack directly,
e.g. [`?domain=food-science`](https://trusttool.borck.education/?domain=food-science).
The `<id>` is the domain's `id` field in `js/scenarios.js`.

## Adding a domain or scenarios

Edit `js/scenarios.js`. Each domain is:

```js
{
    id: "my-domain",            // used for the localStorage best-score key
    name: "My Domain",
    emoji: "🎓",
    description: "One-line description shown on the picker.",
    scenarios: [
        {
            title: "Short card title",
            text: "The full scenario shown in the ⓘ popup.",
            answer: "average-small", // average-small | precise-small | average-large | precise-large
            explain: "Shown when the card lands in the right quadrant."
        },
        // aim for ~10, mixed across all four quadrants
    ]
}
```

## Origin

Extracted and extended from the [AI + The Human Edge workshop](../curtin/presentations/food-science-ai-workshop)
(Curtin University), where a single-domain, one-scenario-at-a-time version runs as
`interactive-tools/trust_tool_game.html`.

## See also

[AI Toys](https://aitoys.borck.education/) — sibling collection of single-file pages that each
break one AI/ML misconception. The Trust Tool has a card there but stays its own repo: it's
multi-file, has 16 scenario packs, and remembers best scores, all of which the toys' house
rules forbid.

## License

MIT
