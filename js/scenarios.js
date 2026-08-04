// Trust Tool scenario packs.
// Each scenario: short card title, full text, correct quadrant, explanation
// (shown once the card lands in the right quadrant).
//
// Quadrant keys:
//   average-small  = 🟢 Trust with Light Review   (Average is fine + Small consequences)
//   precise-small  = 🟡 Verify Before You Ship    (Must be Precise + Small consequences)
//   average-large  = 🟡 Verify Load-Bearing Bits  (Average is fine + Large consequences)
//   precise-large  = 🔴 Human-in-the-Loop         (Must be Precise + Large consequences)

const QUADRANTS = {
    "average-small": {
        emoji: "🟢",
        name: "Trust with Light Review",
        axes: "Average is fine · Small consequences",
        color: "green",
        detail: {
            summary: "The output only needs to be roughly right, and little goes wrong if it isn't. Skim it, fix anything odd, and move on.",
            examples: [
                "Brainstorming names, ideas, angles, hypotheses",
                "First-draft summaries you'll verify against the source anyway",
                "Polishing tone and wording of low-stakes text"
            ],
            rule: "Rule of thumb: if a mediocre answer costs you five minutes at most, it lives here."
        }
    },
    "precise-small": {
        emoji: "🟡",
        name: "Verify Before You Ship",
        axes: "Must be Precise · Small consequences",
        color: "yellow",
        detail: {
            summary: "The answer has to be exactly right — a specific value, name, or syntax — but a mistake is cheap to catch and fix. Check it against a reliable source before you use it.",
            examples: [
                "Exact command flags, formulas, or config for a low-stakes task",
                "A specific fact, figure, or citation for internal work",
                "Which test / method / code to use, when you'll double-check anyway"
            ],
            rule: "Rule of thumb: precision matters, but the blast radius is contained. Verify once, then trust it."
        }
    },
    "average-large": {
        emoji: "🟡",
        name: "Verify Load-Bearing Bits",
        axes: "Average is fine · Large consequences",
        color: "yellow",
        detail: {
            summary: "The prose can be average, but the stakes are high — funding, reputation, big decisions. Most of the draft is fine; find the claims that carry the weight and verify those personally.",
            examples: [
                "Grant proposals, pitch decks, strategy documents",
                "High-stakes communications (crisis response, restructure announcements)",
                "Reports where a few key claims decide the outcome"
            ],
            rule: "Rule of thumb: ask 'which sentences, if wrong, sink this?' — verify those, skim the rest."
        }
    },
    "precise-large": {
        emoji: "🔴",
        name: "Human-in-the-Loop",
        axes: "Must be Precise · Large consequences",
        color: "red",
        detail: {
            summary: "The answer must be exactly right AND a mistake can harm a person, breach a regulation, lose serious money, or break production. A qualified human verifies against the authoritative source before anything ships. Non-negotiable.",
            examples: [
                "Safety limits, medical or legal thresholds, compliance claims",
                "Anything executed automatically against production systems or money",
                "Figures and citations that go into published or filed documents"
            ],
            rule: "Rule of thumb: if a wrong answer could end up in a headline, a lawsuit, or a hospital — it's red."
        }
    }
};

const DOMAINS = [
    {
        id: "food-science",
        name: "Food Science",
        emoji: "🥛",
        description: "Product development, food safety, labelling, and research.",
        scenarios: [
            { title: "Yogurt names", text: "You ask AI to brainstorm 10 catchy names for your oat-milk yogurt product.", answer: "average-small",
              explain: "A name just needs to sound good — average is fine. If a name is a dud, the blast radius is tiny. Light review and move on." },
            { title: "HACCP pH value", text: "AI gives you the exact pH value to cite in your HACCP food-safety documentation for an acidified product.", answer: "precise-large",
              explain: "A wrong pH in a safety document can mean regulatory failure or unsafe food. Precise + Large = human-in-the-loop, non-negotiable." },
            { title: "Paper summary", text: "AI writes a first-draft summary of a paper for your literature review. You'll read the paper yourself later.", answer: "average-small",
              explain: "It's a first-pass orientation tool and you'll verify by reading the source. Green — but if you *don't* read the paper later, this jumps quadrants." },
            { title: "Stats test choice", text: "AI suggests which statistical test to use for your sensory panel data (you'll quote it in your thesis methods section).", answer: "precise-small",
              explain: "The test name must be exactly right (precise), but if it's wrong the blast radius is a thesis correction, not a safety incident. Verify against the methods literature before you ship." },
            { title: "Grant proposal", text: "AI drafts the framing and key arguments of a grant proposal you'll submit for $150,000 of research funding.", answer: "average-large",
              explain: "The prose can be average, but the framing decides whether you get funded — large consequences. Verify the load-bearing bits: the claims, the novelty, the alignment with the call." },
            { title: "Allergen threshold", text: "AI tells you the allergen-labelling threshold for a 'may contain traces of nuts' statement on your product.", answer: "precise-large",
              explain: "Allergen information that is wrong can hospitalise someone. This is the definition of the red quadrant — a human must check the actual regulation." },
            { title: "Abstract polish", text: "AI rewrites your abstract to sound more polished before you submit to a conference.", answer: "average-small",
              explain: "Polish is average-is-fine territory, and the blast radius of a clunky sentence is small. Skim it, keep your voice, ship it." },
            { title: "Nutrition label", text: "AI generates a table of nutritional values per serve that will go on your product's packaging label.", answer: "precise-large",
              explain: "Label values must be exact and legally compliant. Red quadrant — lab-verified values only; AI output is a draft at best." },
            { title: "Fermentation ideas", text: "AI proposes three alternative explanations for why your co-culture fermentation acidified faster than expected.", answer: "average-small",
              explain: "Hypothesis generation is classic green: you want breadth, not precision, and you'll test the ideas experimentally anyway." },
            { title: "Shelf-life claim", text: "AI recommends the maximum storage temperature for a shelf-life claim you'll print on packaging ('keeps 21 days refrigerated').", answer: "precise-large",
              explain: "A shelf-life claim that is wrong is a food-safety and legal failure. Red — this needs challenge testing in a lab, not a chatbot answer." }
        ]
    },
    {
        id: "information-security",
        name: "Information Security",
        emoji: "🔐",
        description: "Threats, compliance, incident response, and security operations.",
        scenarios: [
            { title: "Awareness slogans", text: "You ask AI to brainstorm slogans for a phishing-awareness poster campaign.", answer: "average-small",
              explain: "Slogans just need to be catchy. A weak one costs nothing — pick the good ones and move on." },
            { title: "Threat brainstorm", text: "AI proposes possible attack vectors to consider in a threat-modelling workshop for a new internal app.", answer: "average-small",
              explain: "Brainstorming attack vectors is breadth-over-precision, and every idea gets scrutinised by the team anyway. Classic green." },
            { title: "Whitepaper summary", text: "AI summarises a 60-page vendor security whitepaper so you can decide whether it's worth reading properly.", answer: "average-small",
              explain: "It's an orientation pass — if the summary is imperfect, you lose a little time, nothing more. If you were citing it to others, it would jump quadrants." },
            { title: "SMBv1 registry key", text: "AI gives you the exact registry key to disable SMBv1 on a test VM you're hardening.", answer: "precise-small",
              explain: "Registry keys must be exactly right or nothing happens (or the wrong thing does) — but it's a test VM, so the blast radius is contained. Verify against Microsoft's docs, then apply." },
            { title: "CVE lookup", text: "AI tells you which CVE ID matches a vulnerability in your Apache version, for an internal prioritisation ticket.", answer: "precise-small",
              explain: "CVE IDs must be exact — a wrong ID sends someone down the wrong path — but it's an internal ticket that a human reads before acting. Verify against the NVD, then file it." },
            { title: "Breach email", text: "AI drafts the notification email to customers after a data breach at your company.", answer: "average-large",
              explain: "The wording can be average, but this lands in front of every customer, regulators, and possibly journalists. Verify the load-bearing bits: what happened, what data, what you're legally required to say." },
            { title: "RFP security section", text: "AI drafts the security section of your response to a major client's RFP.", answer: "average-large",
              explain: "Decent prose is fine, but any claim about your controls becomes contractual. Verify every 'we do X' statement — those are the load-bearing bits." },
            { title: "Edge firewall rule", text: "AI writes the exact firewall rule to block a suspicious subnet on your production edge firewall.", answer: "precise-large",
              explain: "One wrong octet blocks legitimate traffic or leaves the hole open — on production, at the perimeter. Red: a network engineer reviews before it's applied." },
            { title: "AD cleanup script", text: "AI generates a script to bulk-delete stale accounts from Active Directory, scheduled to run tonight.", answer: "precise-large",
              explain: "Automated, destructive, and against your identity system: the definition of red. A human reviews the script AND the account list, and you run it in dry-run mode first." },
            { title: "Compliance question", text: "AI tells you whether your ISO 27001 certification permits replacing password rotation with MFA, for your audit response.", answer: "precise-large",
              explain: "Audit responses are compliance claims. If AI paraphrases the standard wrongly, you fail an audit or carry hidden risk. A human checks the actual standard and your Statement of Applicability." }
        ]
    },
    {
        id: "programming",
        name: "Programming",
        emoji: "💻",
        description: "Code, tooling, architecture, and production systems.",
        scenarios: [
            { title: "CLI tool names", text: "You ask AI to brainstorm names for a new command-line tool you're building.", answer: "average-small",
              explain: "Naming brainstorms are pure green — you want volume and vibes, and a bad suggestion costs nothing." },
            { title: "Regex explainer", text: "AI explains what a gnarly regex in the codebase does, to help you orient before refactoring.", answer: "average-small",
              explain: "It's orientation — you'll read and test the code yourself as you refactor. If you were trusting the explanation blindly for a change, it would move up." },
            { title: "Test scaffolding", text: "AI generates boilerplate unit-test scaffolding that you'll fill in with real assertions.", answer: "average-small",
              explain: "Scaffolding just needs to be roughly right; your own assertions and the test runner will catch problems immediately." },
            { title: "ffmpeg flags", text: "AI gives you the exact ffmpeg flags to convert a video file on your laptop.", answer: "precise-small",
              explain: "Flags must be exactly right or the command fails or produces the wrong output — but it's one local file. Run it, check the output, done." },
            { title: "Analytics SQL", text: "AI writes a SQL query to answer a one-off analytics question you're curious about.", answer: "precise-small",
              explain: "SQL must be precisely right to give the right numbers — a subtly wrong JOIN lies to you convincingly. But it's read-only and one-off: sanity-check the results, then trust it. If the numbers were going to the board, it would turn red." },
            { title: "Architecture doc", text: "AI drafts the architecture proposal your team will debate for next quarter's platform rebuild.", answer: "average-large",
              explain: "The draft can be average — the team will tear it apart anyway — but the direction it sets is high-stakes. Verify the load-bearing claims: scaling assumptions, cost estimates, migration risks." },
            { title: "Release docs", text: "AI writes the README and getting-started guide for your open-source project's 1.0 release.", answer: "average-large",
              explain: "Prose can be average, but wrong install commands or API examples burn every new user's first impression. Verify the load-bearing bits: every command and code sample must actually run." },
            { title: "Prod migration", text: "AI writes a database migration that renames and drops columns, to run against production.", answer: "precise-large",
              explain: "Destructive, irreversible, and on production data. Red: a human reviews the SQL, you test on a staging copy, and you have a rollback plan before it runs." },
            { title: "Auth code", text: "AI writes the password-hashing and JWT-validation code for your app's login system.", answer: "precise-large",
              explain: "Security-critical code fails silently — it works fine right up until someone exploits it. Red: expert review, established libraries, and tests against known attack cases." },
            { title: "Server cleanup", text: "AI suggests a cleanup script using rm -rf to free disk space across your production servers.", answer: "precise-large",
              explain: "One wrong path variable and production is gone. Red: human review, run on one machine first, and prefer a script that lists before it deletes." }
        ]
    },
    {
        id: "business",
        name: "Business",
        emoji: "📊",
        description: "Strategy, operations, HR, and finance.",
        scenarios: [
            { title: "Offsite agenda", text: "AI brainstorms agenda items and activities for your team's quarterly offsite.", answer: "average-small",
              explain: "Ideas for an agenda are green — you'll pick what fits, and a weak suggestion costs nothing." },
            { title: "Lunch policy memo", text: "AI drafts an internal memo announcing the new office lunch-ordering policy.", answer: "average-small",
              explain: "Low-stakes internal comms: skim for tone and accuracy, send. Worst case is a follow-up clarification email." },
            { title: "Report briefing", text: "AI summarises a 90-page industry report so you're oriented before a meeting.", answer: "average-small",
              explain: "Personal orientation is green. If you quote the summary's numbers in the meeting without checking them, you've silently changed quadrants." },
            { title: "Slide statistic", text: "AI pulls the exact market-growth statistic from an annual report for your internal team presentation.", answer: "precise-small",
              explain: "A quoted statistic must be exact, but an internal slide has a small blast radius. Check it against the actual report — AI is notorious for confident wrong numbers." },
            { title: "Break-even calc", text: "AI calculates the break-even point for a what-if pricing analysis you're exploring.", answer: "precise-small",
              explain: "The arithmetic must be right for the analysis to mean anything, but it's exploratory. Recompute the key figure yourself before anyone acts on it." },
            { title: "Investor pitch", text: "AI drafts the narrative for your Series A investor pitch deck.", answer: "average-large",
              explain: "Storytelling can be average — you'll rehearse and refine it — but the claims decide whether you raise. Verify every number, projection, and market claim: those are load-bearing." },
            { title: "Restructure comms", text: "AI drafts the all-staff announcement of a restructure that includes redundancies.", answer: "average-large",
              explain: "The prose matters less than getting the facts, tone, and legal phrasing right in a message people will remember forever. Verify the load-bearing bits with HR and legal." },
            { title: "Termination law", text: "AI explains the legal requirements for terminating an employee in your jurisdiction.", answer: "precise-large",
              explain: "Employment law is precise and getting it wrong means unfair-dismissal claims. Red: a human checks the actual legislation or you talk to an employment lawyer." },
            { title: "Filed financials", text: "AI produces the revenue figures for the financial statements you'll file with the regulator.", answer: "precise-large",
              explain: "Filed financials must be exact and are legally binding. Red — figures come from your accounting system and are verified by an accountant, not generated by a chatbot." },
            { title: "Contract clause", text: "AI drafts the liability clause for a major supplier contract you're about to sign.", answer: "precise-large",
              explain: "Contract language is precise by nature and this clause allocates real risk. Red: a lawyer reviews before signature." }
        ]
    },
    {
        id: "marketing",
        name: "Marketing",
        emoji: "📣",
        description: "Campaigns, brand, content, and customer communications.",
        scenarios: [
            { title: "Campaign taglines", text: "AI brainstorms 20 taglines for your spring campaign.", answer: "average-small",
              explain: "Tagline brainstorms are green: you want volume, you'll shortlist, and the duds cost nothing." },
            { title: "Social drafts", text: "AI drafts a week of social posts that you'll skim and schedule.", answer: "average-small",
              explain: "Routine social content with a human skim is green. A flat post has a small blast radius — delete and repost." },
            { title: "Persona ideas", text: "AI generates customer-persona ideas to seed a strategy workshop.", answer: "average-small",
              explain: "Workshop fodder is green — the personas get challenged and rebuilt by the team using real data anyway." },
            { title: "UTM links", text: "AI writes the exact UTM parameters for the tracking links in a small A/B email test.", answer: "precise-small",
              explain: "UTM syntax must be exact or your attribution data is garbage — but it's a small test. Click each link and check your analytics before sending." },
            { title: "Competitor pricing", text: "AI reports a competitor's current pricing for your internal sales battle card.", answer: "precise-small",
              explain: "Pricing must be exactly right or your sales team looks foolish — but it's an internal card. Verify on the competitor's actual pricing page; AI training data is stale." },
            { title: "Repositioning deck", text: "AI drafts the strategy deck proposing a full brand repositioning to the executive team.", answer: "average-large",
              explain: "The deck's prose can be average, but the strategic claims — market data, customer evidence, revenue projections — decide a major bet. Verify those personally." },
            { title: "PR crisis reply", text: "AI drafts your company's public response to a PR crisis that's trending on social media.", answer: "average-large",
              explain: "Speed matters and a draft helps, but one wrong phrase becomes the next headline. A human verifies the facts and legal exposure in every sentence before it posts." },
            { title: "Health claims", text: "AI writes ad copy including the claim 'clinically proven to improve gut health' for your product.", answer: "precise-large",
              explain: "Health claims are regulated — 'clinically proven' has a legal threshold. Red: regulatory/legal review against the actual evidence, or the regulator does it for you." },
            { title: "Competition T&Cs", text: "AI writes the terms and conditions for a public prize competition you're running.", answer: "precise-large",
              explain: "Competition T&Cs are a legal document with real liability — permit requirements, prize law, exclusions. Red: legal review before publication." },
            { title: "Mass discount email", text: "AI generates a personalised email with discount codes, sent automatically to your entire customer database.", answer: "precise-large",
              explain: "Codes and personalisation must be exact, and the send is automated at full scale — no human catches it mid-flight. Red: test segment first, human checks the codes and the merge fields." }
        ]
    },
    {
        id: "supply-chain",
        name: "Supply Chain",
        emoji: "🚚",
        description: "Procurement, logistics, customs, and inventory.",
        scenarios: [
            { title: "Supplier ideas", text: "AI brainstorms alternative packaging suppliers worth investigating in your region.", answer: "average-small",
              explain: "A research starting point — you'll vet every candidate anyway. Some suggestions will be stale or wrong; that's fine at this stage." },
            { title: "Trends summary", text: "AI summarises a logistics-trends report so you're oriented before a planning meeting.", answer: "average-small",
              explain: "Personal orientation is green. The moment those trends drive an actual decision, verify the specific claims." },
            { title: "Late-shipment nudge", text: "AI drafts a polite email chasing a supplier about a late shipment.", answer: "average-small",
              explain: "Routine correspondence: skim for tone and facts, send. Worst case is a slightly awkward sentence." },
            { title: "HS code estimate", text: "AI looks up the HS tariff code for a new product, for your internal landed-cost estimate spreadsheet.", answer: "precise-small",
              explain: "Tariff codes must be exact for the estimate to be useful, but an internal spreadsheet has a small blast radius. Verify against the official tariff schedule before the estimate drives decisions." },
            { title: "Pallet maths", text: "AI calculates cartons-per-pallet and container utilisation for your internal planning sheet.", answer: "precise-small",
              explain: "The arithmetic must be right, but a planning sheet gets sanity-checked in use. Recompute the key figure — AI is surprisingly bad at logistics arithmetic." },
            { title: "Negotiation strategy", text: "AI drafts your negotiation strategy for renewing the contract with your single largest supplier.", answer: "average-large",
              explain: "Strategy framing can be average — you'll adapt in the room — but the stakes are your biggest contract. Verify the load-bearing assumptions: their alternatives, your volumes, the market price." },
            { title: "Board risk memo", text: "AI drafts the board memo assessing the risk of your single-source dependency on one overseas supplier.", answer: "average-large",
              explain: "Boards act on these memos. Prose can be average; the risk claims and figures are load-bearing and must be verified before it goes up." },
            { title: "Auto reorder points", text: "AI calculates reorder points and quantities that feed directly into your automated purchasing system.", answer: "precise-large",
              explain: "Wrong numbers here silently place wrong orders at scale — tied-up capital or stockouts. Red: a planner reviews before anything is automated, and you monitor the first cycles." },
            { title: "Customs declaration", text: "AI provides the HS tariff code you'll put on the actual customs declaration for a commercial import.", answer: "precise-large",
              explain: "Customs declarations are legal documents — wrong codes mean fines, seizures, and audits. Red: verified against the official schedule, ideally by a licensed customs broker." },
            { title: "Cold-chain limits", text: "AI states the temperature limits for cold-chain shipping of a perishable pharmaceutical product.", answer: "precise-large",
              explain: "Out-of-range products can harm the people who receive them. Red: the limits come from the product's stability data and regulatory file, verified by qualified humans." }
        ]
    },
    {
        id: "investing",
        name: "Investing",
        emoji: "📈",
        description: "Markets, analysis, tax, and personal finance.",
        scenarios: [
            { title: "Sector ideas", text: "AI brainstorms sectors and themes that might be worth researching this year.", answer: "average-small",
              explain: "A starting point for your own research — breadth over precision, and nothing is at stake until you act on it." },
            { title: "ETF explainer", text: "AI explains the difference between ETFs and managed funds while you're learning the basics.", answer: "average-small",
              explain: "Conceptual learning is green: roughly right is genuinely useful, and you'll encounter corrections as you learn more." },
            { title: "Earnings recap", text: "AI summarises an earnings call so you can decide whether the company deserves a deeper look.", answer: "average-small",
              explain: "Orientation before your own analysis is green. If the summary alone triggers a trade, you've changed quadrants without noticing." },
            { title: "Watchlist data", text: "AI fills in ticker symbols and expense ratios for the watchlist spreadsheet you maintain.", answer: "precise-small",
              explain: "Tickers and ratios must be exact to be useful, but a watchlist is just a watchlist. Verify against the fund provider's page — AI hallucinates plausible tickers." },
            { title: "Compound calc", text: "AI calculates a compound-growth scenario for your personal retirement planning sheet.", answer: "precise-small",
              explain: "The maths must be right for the plan to mean anything, but it's your own exploratory sheet. Recompute with a calculator before making real decisions from it." },
            { title: "Club thesis", text: "AI drafts the investment thesis you'll pitch to your investment club next month.", answer: "average-large",
              explain: "The narrative can be average — but people may put real money behind it. Verify the load-bearing facts: the financials, the competitive claims, the valuation logic." },
            { title: "Allocation plan", text: "AI drafts an asset-allocation framework for your whole portfolio.", answer: "average-large",
              explain: "Frameworks are directionally useful, but this steers your life savings. Verify the assumptions about risk, horizon, and fees — and stress-test against your actual situation." },
            { title: "CGT timing", text: "AI tells you the tax consequences of selling shares now versus after the 12-month capital-gains discount date.", answer: "precise-large",
              explain: "Tax rules are precise, jurisdiction-specific, and mistakes cost real money at filing time. Red: check the tax office's actual guidance or ask an accountant." },
            { title: "Leveraged trade", text: "AI gives a price target for a stock, and you're about to place a large leveraged trade based on it.", answer: "precise-large",
              explain: "A leveraged position amplifies any error, and AI price targets are confident guesses. Red: this needs your own analysis — or a smaller, unleveraged position while you do it." },
            { title: "Debt covenants", text: "AI summarises a company's debt covenants from its annual report before you invest a large part of your savings.", answer: "precise-large",
              explain: "Covenant details are precise legal terms that determine bankruptcy risk, and your savings are the blast radius. Red: read the actual filing — this is exactly where AI summaries drop the critical footnote." }
        ]
    },
    {
        id: "consulting",
        name: "Consulting",
        emoji: "💼",
        description: "Client work, analysis, reports, and deliverables.",
        scenarios: [
            { title: "Discovery questions", text: "AI brainstorms interview questions for your stakeholder discovery sessions.", answer: "average-small",
              explain: "Question brainstorms are green — you'll curate them, and weak questions get dropped naturally in the room." },
            { title: "Meeting notes", text: "AI turns your rough meeting notes into a tidy internal summary for the project file.", answer: "average-small",
              explain: "Internal notes with your own memory as backup: skim for anything it got wrong, file it, move on." },
            { title: "Icebreakers", text: "AI suggests icebreaker activities for tomorrow's client workshop.", answer: "average-small",
              explain: "Low stakes, fully under your control on the day. Pick two, have a backup, done." },
            { title: "Working-paper stat", text: "AI pulls a specific statistic from a public report for your internal working paper.", answer: "precise-small",
              explain: "The number must be exact — it may migrate into client work later — but a working paper is internal. Verify against the actual report now, so a wrong number never starts travelling." },
            { title: "Model formula", text: "AI writes the Excel formula for a lookup in your draft internal analysis model.", answer: "precise-small",
              explain: "Formulas must be exactly right — spreadsheet errors are silent — but it's a draft model you'll test. Check it against a hand-calculated case before building on it." },
            { title: "Exec summary", text: "AI drafts the executive summary of your final report to the client.", answer: "average-large",
              explain: "The summary is what the client's executives actually read. Prose can be average; every finding and number in it is load-bearing and must match the verified body of the report." },
            { title: "Change comms plan", text: "AI drafts the change-management communications plan for a client's major system rollout.", answer: "average-large",
              explain: "The plan structure can be average — but it shapes how thousands of employees experience the change. Verify the key messages, timing, and anything that sets expectations." },
            { title: "Market sizing", text: "AI produces the market-size figures that will appear in the client's board presentation.", answer: "precise-large",
              explain: "Numbers in a board deck get quoted, re-quoted, and acted on. Red: every figure is traced to a verifiable source by a human before it ships — 'AI estimated it' is not a source." },
            { title: "Report citations", text: "AI generates the citations and references for a report your firm is delivering to a government department.", answer: "precise-large",
              explain: "This is the Deloitte scenario — fabricated citations in a government report, discovered publicly, refund issued. Red: a human verifies every single reference exists and says what's claimed." },
            { title: "Salary benchmarks", text: "AI provides the salary benchmark figures underpinning your restructure recommendation to a client.", answer: "precise-large",
              explain: "These numbers change real people's jobs and pay. Red: benchmarks come from verifiable salary data with a named source, checked by a human." }
        ]
    },
    {
        id: "researcher",
        name: "Researcher",
        emoji: "🔬",
        description: "Literature, grants, data, ethics, and publication.",
        scenarios: [
            { title: "Title ideas", text: "AI brainstorms 15 possible titles for the manuscript you're about to submit.", answer: "average-small",
              explain: "Title brainstorms are green — you want options, you'll pick one, and a weak suggestion costs nothing." },
            { title: "Abstract triage", text: "AI summarises 40 abstracts so you can shortlist which papers deserve a full read for your review.", answer: "average-small",
              explain: "Triage is an orientation pass — the shortlisted papers get read properly, and a paper wrongly excluded can still surface later through citations. If the summaries replaced reading, this would jump quadrants." },
            { title: "Hypothesis ideas", text: "AI proposes alternative explanations for an unexpected result in your pilot data.", answer: "average-small",
              explain: "Hypothesis generation is classic green: breadth beats precision, and every idea gets tested against data anyway." },
            { title: "APA conversion", text: "AI converts your reference list to APA 7 formatting for the internal draft you're circulating to co-authors.", answer: "precise-small",
              explain: "Formatting must be exactly right eventually, but an internal draft has a small blast radius and co-authors are another check. Verify before submission — and never let AI *invent* the references, only reformat them." },
            { title: "Power analysis", text: "AI runs a sample-size calculation while you're scoping a study design, before anything goes to ethics.", answer: "precise-small",
              explain: "The calculation must be right to be useful, but at scoping stage the blast radius is your own planning. Redo it in G*Power or with a statistician before it enters the ethics application — then it's load-bearing." },
            { title: "Grant narrative", text: "AI drafts the significance and innovation sections of your ARC Discovery proposal.", answer: "average-large",
              explain: "The prose can be average — you'll rewrite it in your voice — but the framing decides years of funding. Verify the load-bearing bits: every claim, citation, and figure in the proposal." },
            { title: "Reviewer rebuttal", text: "AI drafts your response letter to the reviewers who recommended major revisions.", answer: "average-large",
              explain: "The tone and structure can be average, but this letter decides whether the paper gets in. Verify every technical claim you make in it — a wrong rebuttal statement torpedoes your credibility with the reviewer." },
            { title: "Ethics scope", text: "AI tells you whether your existing ethics approval covers recruiting a new participant group.", answer: "precise-large",
              explain: "Recruiting outside your approval is a research-integrity breach with real consequences for participants and your career. Red: check the actual approval and ask the ethics office." },
            { title: "Reported stats", text: "AI computes the statistical results that will be reported in the paper you're submitting.", answer: "precise-large",
              explain: "Published statistics must be exact and reproducible — errors here mean corrections, retractions, and damaged trust. Red: run the analysis yourself in code you can re-execute, and have a co-author check it." },
            { title: "Review references", text: "AI generates the reference list for the systematic review you're submitting for publication.", answer: "precise-large",
              explain: "AI fabricates plausible references — this is exactly how fake citations end up in published reviews. Red: every reference verified to exist and to say what you claim, by a human, against the actual source." }
        ]
    },
    {
        id: "lecturer",
        name: "Lecturer",
        emoji: "🎓",
        description: "Teaching, assessment, feedback, and unit design.",
        scenarios: [
            { title: "Icebreakers", text: "AI suggests icebreaker activities for your first tutorial of semester.", answer: "average-small",
              explain: "Low stakes and fully under your control in the room. Pick two, have a backup, done." },
            { title: "Slide polish", text: "AI tidies the wording on your lecture slides the night before class.", answer: "average-small",
              explain: "You know the content and you're presenting it live — you're the safety net. Skim for anything it changed in meaning, then move on." },
            { title: "Discussion prompts", text: "AI generates discussion questions for this week's seminar reading.", answer: "average-small",
              explain: "Prompts just need to spark conversation, and you'll steer the discussion live. Green — curate and go." },
            { title: "Practice quiz", text: "AI drafts multiple-choice questions and the answer key for an ungraded practice quiz.", answer: "precise-small",
              explain: "Answer keys must be exactly right — a wrong key teaches the wrong thing — but an ungraded quiz is a contained blast radius. Check every answer before you post it; AI-written MCQs are wrong more often than they look." },
            { title: "Demo code", text: "AI writes the code example you'll run live in tomorrow's programming lecture.", answer: "precise-small",
              explain: "Code must actually run — but a broken demo in front of a class is recoverable (and occasionally a teaching moment). Run it end-to-end tonight, not live for the first time." },
            { title: "Unit outline", text: "AI drafts the learning outcomes and assessment structure for a new unit going to the board of studies for approval.", answer: "average-large",
              explain: "The wording can be average — committees will polish it — but the outcomes and assessment design bind you for years and go through formal approval. Verify the load-bearing decisions yourself." },
            { title: "Feedback at scale", text: "AI drafts personalised feedback comments on 200 student assignments, which you'll skim and release.", answer: "average-large",
              explain: "Feedback prose can be average, but wrong claims about a student's work erode trust at scale — and a 'skim' of 200 comments is where errors slip through. Verify the load-bearing bits: anything tied to marks or misconduct, and spot-check the rest properly." },
            { title: "Grade aggregation", text: "AI aggregates and scales the final marks you'll submit to the board of examiners.", answer: "precise-large",
              explain: "Marks decide progression, honours, and appeals — and errors are systematic, not one-off. Red: computed in your marks system or a checked spreadsheet, verified by a human before submission." },
            { title: "Misconduct call", text: "AI judges whether a student's essay was AI-written, and you'll act on its verdict.", answer: "precise-large",
              explain: "AI detectors are unreliable and a false accusation seriously harms a student. Red: detection output is at most a prompt for a human process — evidence, conversation, due process — never a verdict." },
            { title: "Policy advice", text: "AI reads the assessment policy and you relay its answer to a student asking about extension rights before a deadline.", answer: "precise-large",
              explain: "The student will act on what you tell them, and a wrong answer can cost them their assessment. Red: check the actual policy — AI paraphrases of policy are confidently wrong about edge cases." }
        ]
    },
    {
        id: "professional-staff",
        name: "Professional Staff",
        emoji: "🗂️",
        description: "University operations: student services, policy, records, and comms.",
        scenarios: [
            { title: "O-week ideas", text: "AI brainstorms activities for orientation week that your team could run.", answer: "average-small",
              explain: "Idea generation for an internal planning session is green — the team filters, budgets, and reality-checks everything anyway." },
            { title: "Email polish", text: "AI tidies the wording of a routine internal email to another team.", answer: "average-small",
              explain: "Routine internal comms: skim for tone and facts, send. Worst case is a clarifying reply." },
            { title: "Minutes tidy-up", text: "AI turns your rough notes from a project meeting into tidy minutes for the file.", answer: "average-small",
              explain: "You were in the meeting — you're the fact-check. Skim for anything it invented or dropped, file, done." },
            { title: "Room capacities", text: "AI fills in room capacities for the internal spreadsheet you're using to plan semester events.", answer: "precise-small",
              explain: "Capacities must be exact to be useful, but an internal planning sheet gets checked against bookings before anything is committed. Verify against the facilities database before the plan locks in." },
            { title: "Merge fields", text: "AI sets up the mail-merge fields for a test send of the staff newsletter.", answer: "precise-small",
              explain: "Merge fields must be exactly right — 'Dear {FirstName}' is embarrassing — but it's a test send to yourselves. Check the test output carefully before the real send (which is a bigger quadrant)." },
            { title: "Consultation paper", text: "AI drafts the discussion paper for a policy review that will go out to all staff for consultation.", answer: "average-large",
              explain: "The prose can be average, but this frames a university-wide conversation and will be quoted back at you. Verify the load-bearing bits: the current-state facts, the options, and anything implying a decision has been made." },
            { title: "DVC briefing", text: "AI drafts a briefing note for the DVC on an emerging issue in your portfolio.", answer: "average-large",
              explain: "Executives act on briefings. Structure and prose can be average; every fact and figure is load-bearing and must be verified before it goes up the chain." },
            { title: "Records script", text: "AI writes a script to bulk-update enrolment records in the student system tonight.", answer: "precise-large",
              explain: "Automated changes to student records at scale — errors affect real students' enrolment, fees, and graduation. Red: human review, test environment first, and a rollback plan." },
            { title: "Census-date advice", text: "AI answers a student's question about the fee consequences of withdrawing after census date, and you relay it.", answer: "precise-large",
              explain: "The student makes a financial decision based on your answer. Red: check the actual policy and the student's specific record — or refer to the team who owns the answer." },
            { title: "Visa conditions", text: "AI advises what an international student's visa conditions allow regarding reduced study load.", answer: "precise-large",
              explain: "Wrong visa advice can cost a student their visa. Red: this comes from the responsible international-student team against current immigration rules, never from a chatbot." }
        ]
    },
    {
        id: "academic",
        name: "Academic",
        emoji: "📚",
        description: "Supervision, peer review, committees, and academic service.",
        scenarios: [
            { title: "Committee agenda", text: "AI brainstorms agenda items for the teaching and learning committee you chair.", answer: "average-small",
              explain: "Agenda brainstorms are green — you'll curate, and the committee will reshape it in the first five minutes anyway." },
            { title: "HDR workshop ideas", text: "AI suggests topics and activities for a professional-development workshop for your research students.", answer: "average-small",
              explain: "Idea generation you'll filter through your knowledge of the students. Weak ideas cost nothing at this stage." },
            { title: "Talk abstract", text: "AI polishes the abstract for an invited seminar you're giving next month.", answer: "average-small",
              explain: "Polish on your own content, which you'll deliver yourself — green. Keep your voice, check it still promises the talk you'll actually give." },
            { title: "Citation metrics", text: "AI fills in your h-index and citation counts while you're updating your internal CV.", answer: "precise-small",
              explain: "Metrics must be exact — an inflated number in a CV is a credibility problem — but an internal update is a contained blast radius. Verify against Scopus or Google Scholar before the CV goes anywhere official." },
            { title: "Criteria checklist", text: "AI extracts a checklist of promotion criteria from the academic policy for your own planning.", answer: "precise-small",
              explain: "The criteria must be exactly right for your planning to be useful, but it's your own working document. Verify against the actual policy before you build your case on it — and definitely before advising anyone else." },
            { title: "Reference letter", text: "AI drafts a reference letter for a former student applying for a graduate role.", answer: "average-large",
              explain: "The prose can be average, but your name is on it and it shapes someone's career. Verify the load-bearing bits: every factual claim about the student must be true and yours." },
            { title: "Promotion case", text: "AI drafts the narrative for your academic promotion application.", answer: "average-large",
              explain: "The framing can be average — you'll rewrite it — but the stakes are your career, and any inaccurate claim in a promotion case is serious. Verify every achievement, number, and attribution." },
            { title: "Peer review", text: "AI reviews a manuscript you were assigned and you submit its assessment as your review.", answer: "precise-large",
              explain: "Double trouble: uploading an unpublished manuscript to AI can breach confidentiality, and the verdict shapes someone's publication record. Red: the intellectual judgement must be yours — check your journal's AI policy before AI touches the manuscript at all." },
            { title: "Examiner report", text: "AI drafts your examiner's report and recommendation for a PhD thesis you're examining.", answer: "precise-large",
              explain: "A thesis examination is a formal judgement on years of someone's work, and the thesis is confidential. Red: the assessment must be genuinely yours — this is exactly the kind of task institutions expect humans to own." },
            { title: "Candidature call", text: "AI summarises a struggling PhD student's progress reports, and you base a termination-of-candidature recommendation on its summary.", answer: "precise-large",
              explain: "A career-ending decision based on an AI summary that may have dropped the critical context. Red: read the actual reports, talk to the student and panel — the summary can orient you, never decide for you." }
        ]
    },
    {
        id: "executives",
        name: "Executives",
        emoji: "🏢",
        description: "Leadership, board papers, disclosure, and big decisions.",
        scenarios: [
            { title: "Town hall opener", text: "AI polishes the opening remarks for your all-staff town hall next week.", answer: "average-small",
              explain: "You're delivering it live, in your own voice, and can adjust on the fly. Skim for tone, make it sound like you, done." },
            { title: "Offsite formats", text: "AI brainstorms formats and exercises for the leadership team's strategy offsite.", answer: "average-small",
              explain: "Idea generation you'll filter through your knowledge of the team. A weak format suggestion costs nothing at this stage." },
            { title: "Outlook briefing", text: "AI summarises a 100-page industry outlook report so you're oriented before a leadership meeting.", answer: "average-small",
              explain: "Personal orientation is green. The moment you quote its numbers in the meeting — or a board paper — those claims need verifying." },
            { title: "Leadership slide", text: "AI pulls the exact revenue figure from an internal report for a slide in your leadership team meeting.", answer: "precise-small",
              explain: "A quoted figure must be exact — wrong numbers from the top travel fast — but an internal meeting is a contained blast radius. Check it against the source report before presenting." },
            { title: "What-if model", text: "AI runs quick scenario numbers for an internal discussion about next year's headcount options.", answer: "precise-small",
              explain: "The arithmetic must be right for the discussion to be honest, but it's exploratory. Have finance rebuild the model before any option becomes a decision." },
            { title: "Shareholder letter", text: "AI drafts the narrative for your annual letter to shareholders.", answer: "average-large",
              explain: "The prose can be average — you'll rewrite it in your voice — but every claim in it is public and quotable. Verify the load-bearing bits: results, outlook statements, and anything forward-looking." },
            { title: "Strategy paper", text: "AI drafts the framing of the strategy paper you're taking to the board.", answer: "average-large",
              explain: "Boards decide on framing. The draft can be average, but the market claims, competitive assessments, and financials in it steer the company — verify those personally." },
            { title: "Market disclosure", text: "AI drafts a market-sensitive announcement about a profit downgrade for release to the stock exchange.", answer: "precise-large",
              explain: "Continuous-disclosure wording is legally precise and moves the share price. Red: legal counsel and the CFO verify every word against the actual numbers before release." },
            { title: "Redundancy numbers", text: "AI calculates the redundancy entitlements underpinning the restructure you're about to approve.", answer: "precise-large",
              explain: "Entitlements are legally defined, and errors here harm people and end up in court. Red: HR and legal verify against the actual awards and contracts before any decision." },
            { title: "M&A sign-off", text: "AI summarises the due-diligence findings for an acquisition, and you sign off based on its summary.", answer: "precise-large",
              explain: "Due diligence exists to find the buried liability — exactly what a summary can drop. Red: the deal team walks you through the actual findings; the summary orients, it never signs." }
        ]
    },
    {
        id: "mining",
        name: "Mining",
        emoji: "⛏️",
        description: "Operations, geology, safety, and resource reporting.",
        scenarios: [
            { title: "Safety campaign", text: "AI brainstorms themes and slogans for this quarter's site safety campaign.", answer: "average-small",
              explain: "Campaign brainstorms are green — you want options, and the safety team will pick and adapt what fits the site." },
            { title: "Toolbox topics", text: "AI suggests discussion topics for next week's pre-shift toolbox talks.", answer: "average-small",
              explain: "Topic ideas filtered by supervisors who know the crew and the current risks. Weak suggestions get dropped naturally." },
            { title: "Exploration recap", text: "AI summarises decades-old exploration reports so you're oriented before reviewing a tenement.", answer: "average-small",
              explain: "Orientation over historical documents is green — your actual review will go back to the source data before anything is relied on." },
            { title: "Grade conversion", text: "AI converts ore grades from grams per tonne to ounces per ton in your internal planning spreadsheet.", answer: "precise-small",
              explain: "Unit conversions must be exact — grade errors compound through every downstream calculation — but an internal sheet gets checked in use. Verify the conversion factor before the numbers travel." },
            { title: "Haul cycle calc", text: "AI estimates truck cycle times for an internal pit-planning exercise.", answer: "precise-small",
              explain: "The maths must be right to be useful, but a planning exercise is a contained blast radius. Sanity-check against actual fleet data before it shapes the schedule." },
            { title: "Community consult", text: "AI drafts the community consultation document for a proposed mine expansion.", answer: "average-large",
              explain: "The prose can be average, but this document shapes community trust and gets quoted for years. Verify the load-bearing bits: impacts, commitments, and anything that sounds like a promise." },
            { title: "Expansion paper", text: "AI drafts the board paper recommending a $200M plant expansion.", answer: "average-large",
              explain: "Framing can be average — the board will interrogate it — but the capex figures, throughput assumptions, and market case are load-bearing. Verify those against the engineering studies." },
            { title: "Blast exclusion", text: "AI calculates the exclusion-zone radius for tomorrow's blast.", answer: "precise-large",
              explain: "Exclusion zones protect lives and are governed by regulation. Red: the blast engineer calculates this from the actual charge design, and a human signs off. No exceptions." },
            { title: "JORC figures", text: "AI drafts the resource estimate figures for your company's public JORC statement.", answer: "precise-large",
              explain: "JORC reporting is regulated, market-sensitive, and requires a named Competent Person to take responsibility. Red: the numbers come from the geology team's models and the Competent Person owns every figure." },
            { title: "Ground support", text: "AI specifies the rock-bolt pattern and ground support for a new underground heading.", answer: "precise-large",
              explain: "Ground support failures kill people. Red: a geotechnical engineer designs this from the actual ground conditions data, and it's independently checked before anyone works under it." }
        ]
    },
    {
        id: "medical",
        name: "Medical",
        emoji: "🩺",
        description: "Clinical practice, patient safety, and health services.",
        scenarios: [
            { title: "Poster topics", text: "AI brainstorms topics for the health-promotion posters in your clinic's waiting room.", answer: "average-small",
              explain: "Topic brainstorming is green — the actual poster content will be reviewed before anything patient-facing goes up." },
            { title: "Journal club", text: "AI summarises a trial paper so you can decide whether it's worth presenting at journal club.", answer: "average-small",
              explain: "Triage before your own reading is green. If you present from the summary without reading the paper, you've changed quadrants." },
            { title: "QI brainstorm", text: "AI suggests quality-improvement project ideas for reducing clinic waiting times.", answer: "average-small",
              explain: "Idea generation for a QI process that will involve measurement and review anyway. Breadth over precision — classic green." },
            { title: "Item number", text: "AI looks up the billing item number for a procedure, for a draft claim that gets checked before submission.", answer: "precise-small",
              explain: "Item numbers must be exact — wrong billing is a compliance problem — but a checked draft is a contained blast radius. Verify against the actual schedule before submission." },
            { title: "Teaching example", text: "AI builds a worked unit-conversion example (mg to mL) for a slide in your teaching session for students.", answer: "precise-small",
              explain: "The example must be exactly right — students will learn the method from it — but it's a teaching slide you'll present and can correct. Check the arithmetic before class; never reuse it for a real patient." },
            { title: "Ethics narrative", text: "AI drafts the background and significance sections of your clinical research ethics application.", answer: "average-large",
              explain: "The prose can be average, but the application governs what happens to real participants. Verify the load-bearing bits: the evidence claims, the risk statements, and the protocol details." },
            { title: "Service proposal", text: "AI drafts your proposal to hospital executive for a new outpatient clinic service.", answer: "average-large",
              explain: "The narrative can be average — but the demand projections, staffing numbers, and cost estimates decide whether this gets funded and whether it's safe. Verify those against real data." },
            { title: "Drug dose", text: "AI suggests the dose of a medication for the patient in front of you.", answer: "precise-large",
              explain: "Dosing errors harm patients. Red — the definition of it. Doses come from approved references and clinical judgement, checked against the actual patient's weight, renal function, and interactions." },
            { title: "Discharge meds", text: "AI drafts the medication list for a patient's discharge summary.", answer: "precise-large",
              explain: "The discharge summary is what the GP and pharmacist act on — a wrong drug or dose here follows the patient home. Red: reconciled against the chart by a clinician before it's signed." },
            { title: "Symptom triage", text: "AI assesses whether a patient's reported symptoms need urgent referral, and you act on its call.", answer: "precise-large",
              explain: "A missed red flag is a missed diagnosis. Red: AI can help you think of differentials, but the triage decision is clinical judgement with the actual patient — never outsourced." }
        ]
    },
    {
        id: "science",
        name: "Science",
        emoji: "🧪",
        description: "Lab and field work, analysis, and science communication.",
        scenarios: [
            { title: "Outreach demos", text: "AI brainstorms hands-on demo ideas for your lab's stand at the community science fair.", answer: "average-small",
              explain: "Demo brainstorming is green — you'll pick what's feasible and safe, and rehearse before the day." },
            { title: "Poster polish", text: "AI tightens the text on your conference poster the week before printing.", answer: "average-small",
              explain: "Polish on content you know cold, with your own review before printing. Keep your voice, check nothing changed in meaning." },
            { title: "Anomaly ideas", text: "AI proposes possible explanations for the anomalous readings in yesterday's run.", answer: "average-small",
              explain: "Hypothesis generation is classic green — you want breadth, and every candidate explanation gets tested against the data anyway." },
            { title: "Dilution maths", text: "AI calculates the dilution series for a routine buffer prep, which you'll double-check before pipetting.", answer: "precise-small",
              explain: "The maths must be exact or the experiment is quietly ruined — but a routine prep with your own check is a contained blast radius. Recompute the key dilution before you pipette." },
            { title: "Trial-run settings", text: "AI suggests instrument settings for a trial run on test samples before the real batch.", answer: "precise-small",
              explain: "Settings must be precisely right to be meaningful, but a trial run on test samples is exactly the safety net that keeps this yellow. Verify against the method manual before the real batch." },
            { title: "SciComm article", text: "AI drafts your article for The Conversation explaining your research to the public.", answer: "average-large",
              explain: "The prose can be average — editors help — but public claims about your science follow you. Verify the load-bearing bits: every finding, number, and implication attributed to your work." },
            { title: "Industry pitch", text: "AI drafts the pitch deck seeking industry co-funding for your lab's next project.", answer: "average-large",
              explain: "Framing can be average, but the capability claims and preliminary results decide the partnership — and overclaiming to a partner is expensive later. Verify those slides personally." },
            { title: "Chemical mixing", text: "AI tells you whether two chemicals can be safely stored or mixed together.", answer: "precise-large",
              explain: "Incompatibility errors cause fires, toxic gases, and injuries. Red: check the actual SDS sheets and your institution's safety guidance — never a chatbot's recollection of chemistry." },
            { title: "Calibration values", text: "AI provides the calibration constants you'll enter into an instrument whose results go into reported data.", answer: "precise-large",
              explain: "Wrong calibration silently corrupts every downstream result you report. Red: constants come from certified standards and the calibration procedure, entered and verified by a human." },
            { title: "PC2 procedure", text: "AI writes the handling procedure for working with a pathogen in your PC2 lab.", answer: "precise-large",
              explain: "Biosafety procedures protect you, your colleagues, and the community, and are regulated. Red: procedures come from the biosafety manual and your institution's biosafety committee, not generated text." }
        ]
    }
];
