# The Trust Tool

An interactive game for building instinct about **where to trust AI output** — and where a
human must stay in the loop.

Every AI task lives on a 2×2 grid:

|                       | **Average is fine**            | **Must be Precise**               |
| --------------------- | ------------------------------ | --------------------------------- |
| **Large consequences** | 🟡 Verify Load-Bearing Bits    | 🔴 Human-in-the-Loop              |
| **Small consequences** | 🟢 Trust with Light Review     | 🟡 Verify Before You Ship         |

- **x-axis:** how exact does the output need to be? (Average is fine ↔ Must be Precise) — left → right
- **y-axis:** what's the blast radius if it's wrong? (Small ↔ Large) — bottom → top

## How to play

1. Pick a domain: Food Science, Information Security, Programming, Business, Marketing,
   Supply Chain, Investing, Consulting, Executives, Mining, Medical, Science — plus four
   university packs: Researcher, Lecturer, Professional Staff, and Academic.
2. All 10 scenarios appear as mini cards. Tap **ⓘ** on a card to read the full scenario.
3. Drag a card to the quadrant where it belongs — or tap the card, then tap a quadrant.
4. **✓** = correct: the card locks in; tap the ✓ for the explanation.
   **✗** = wrong: tap the ✗ for a hint, then move the card to another quadrant.
5. Only your **first attempt** on each card counts toward your score (X/10). Best scores
   per domain are remembered locally in your browser.
6. Tap **ⓘ** on any quadrant for what that trust level means, with examples and a rule
   of thumb.

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
