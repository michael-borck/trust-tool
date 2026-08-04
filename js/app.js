// Trust Tool game logic: card tray + drag/tap placement + first-try scoring.

(function () {
    "use strict";

    // ---------- DOM ----------
    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");
    const domainGrid = document.getElementById("domainGrid");
    const domainBadge = document.getElementById("domainBadge");
    const trayCards = document.getElementById("trayCards");
    const trayCount = document.getElementById("trayCount");
    const placedCount = document.getElementById("placedCount");
    const scoreCount = document.getElementById("scoreCount");
    const toast = document.getElementById("toast");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalBox = document.getElementById("modalBox");
    const modalContent = document.getElementById("modalContent");
    const resultsOverlay = document.getElementById("resultsOverlay");

    // ---------- State ----------
    let domain = null;        // active domain object
    let items = [];           // [{scenario, el, status, placedIn, attempts, firstTryCorrect}]
    let selectedItem = null;  // item picked via tap-to-place
    let draggedItem = null;   // item being dragged
    let toastTimer = null;

    const bestKey = (id) => "trust-tool-best-" + id;

    // ---------- Domain picker ----------
    function renderDomainGrid() {
        domainGrid.innerHTML = "";
        DOMAINS.forEach((d) => {
            const btn = document.createElement("button");
            btn.className = "domain-card";
            const best = localStorage.getItem(bestKey(d.id));
            btn.innerHTML =
                '<span class="emoji">' + d.emoji + "</span>" +
                '<div class="name">' + d.name + "</div>" +
                '<div class="desc">' + d.description + "</div>" +
                (best !== null
                    ? '<div class="best">★ Best first-try score: ' + best + "/" + d.scenarios.length + "</div>"
                    : "");
            btn.addEventListener("click", () => startGame(d));
            domainGrid.appendChild(btn);
        });
    }

    // ---------- Game setup ----------
    function startGame(d) {
        domain = d;
        selectedItem = null;
        draggedItem = null;

        const shuffled = d.scenarios.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        items = shuffled.map((s) => ({
            scenario: s,
            el: null,
            status: "tray",       // tray | wrong | correct
            placedIn: null,
            attempts: 0,
            firstTryCorrect: false
        }));

        domainBadge.textContent = d.emoji + " " + d.name;
        document.querySelectorAll(".quadrant .cards").forEach((c) => (c.innerHTML = ""));
        trayCards.innerHTML = "";
        items.forEach((item) => {
            item.el = buildCard(item);
            trayCards.appendChild(item.el);
        });

        updateCounters();
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        resultsOverlay.classList.remove("show");
    }

    // ---------- Card construction ----------
    function buildCard(item) {
        const el = document.createElement("div");
        el.className = "mini-card";
        el.draggable = true;

        const title = document.createElement("span");
        title.className = "card-title";
        title.textContent = item.scenario.title;
        el.appendChild(title);

        const info = document.createElement("button");
        info.className = "icon-btn";
        info.title = "Read the full scenario";
        info.textContent = "ⓘ";
        info.addEventListener("click", (e) => {
            e.stopPropagation();
            showScenarioModal(item);
        });
        el.appendChild(info);

        el.addEventListener("click", () => onCardTap(item));

        el.addEventListener("dragstart", (e) => {
            if (item.status === "correct") { e.preventDefault(); return; }
            draggedItem = item;
            el.classList.add("dragging");
            setDropReady(true);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", item.scenario.title);
        });
        el.addEventListener("dragend", () => {
            el.classList.remove("dragging");
            draggedItem = null;
            setDropReady(false);
        });

        return el;
    }

    function setBadge(item) {
        const old = item.el.querySelector(".badge");
        if (old) old.remove();
        if (item.status !== "correct" && item.status !== "wrong") return;

        const badge = document.createElement("button");
        const ok = item.status === "correct";
        badge.className = "badge " + (ok ? "correct" : "wrong");
        badge.textContent = ok ? "✓" : "✗";
        badge.title = ok ? "Why this is right" : "Hint";
        badge.addEventListener("click", (e) => {
            e.stopPropagation();
            if (ok) showExplainModal(item);
            else showHintModal(item);
        });
        item.el.insertBefore(badge, item.el.firstChild);
    }

    // ---------- Selection (tap-to-place) ----------
    function onCardTap(item) {
        if (item.status === "correct") { showExplainModal(item); return; }
        if (selectedItem === item) {
            selectedItem = null;
            item.el.classList.remove("selected");
            setDropReady(false);
            return;
        }
        if (selectedItem) selectedItem.el.classList.remove("selected");
        selectedItem = item;
        item.el.classList.add("selected");
        setDropReady(true);
    }

    function setDropReady(on) {
        document.querySelectorAll(".quadrant").forEach((q) => {
            q.classList.toggle("drop-ready", on);
            if (!on) q.classList.remove("drag-over");
        });
    }

    // ---------- Quadrant wiring ----------
    document.querySelectorAll(".quadrant").forEach((q) => {
        const key = q.dataset.quadrant;

        q.addEventListener("dragover", (e) => {
            if (!draggedItem) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            q.classList.add("drag-over");
        });
        q.addEventListener("dragleave", () => q.classList.remove("drag-over"));
        q.addEventListener("drop", (e) => {
            e.preventDefault();
            q.classList.remove("drag-over");
            if (draggedItem) placeCard(draggedItem, key);
        });

        q.addEventListener("click", (e) => {
            if (e.target.closest(".mini-card") || e.target.closest(".icon-btn")) return;
            if (selectedItem) placeCard(selectedItem, key);
        });

        q.querySelector("[data-quad-info]").addEventListener("click", (e) => {
            e.stopPropagation();
            showQuadrantModal(key);
        });
    });

    // ---------- Placement ----------
    function placeCard(item, quadrantKey) {
        if (item.status === "correct") return;
        if (item.placedIn === quadrantKey) return; // dropped where it already sits

        if (selectedItem === item) {
            item.el.classList.remove("selected");
            selectedItem = null;
        }
        setDropReady(false);

        item.attempts++;
        item.placedIn = quadrantKey;
        const correct = quadrantKey === item.scenario.answer;
        item.status = correct ? "correct" : "wrong";
        if (correct && item.attempts === 1) item.firstTryCorrect = true;

        document.querySelector('[data-cards="' + quadrantKey + '"]').appendChild(item.el);
        item.el.classList.toggle("locked", correct);
        item.el.draggable = !correct;
        setBadge(item);

        item.el.classList.remove("shake", "pop");
        void item.el.offsetWidth; // restart animation
        item.el.classList.add(correct ? "pop" : "shake");

        showToast(
            correct
                ? "✓ Correct" + (item.attempts === 1 ? " — first try!" : ".") + " Tap the ✓ for why."
                : "✗ Not quite. Tap the ✗ for a hint, then drag it somewhere else.",
            correct
        );

        updateCounters();
        if (items.every((i) => i.status === "correct")) {
            setTimeout(showResults, 700);
        }
    }

    function updateCounters() {
        const total = items.length;
        const placed = items.filter((i) => i.status === "correct").length;
        const score = items.filter((i) => i.firstTryCorrect).length;
        placedCount.textContent = placed + "/" + total;
        scoreCount.textContent = score + "/" + total;
        const inTray = items.filter((i) => i.status === "tray").length;
        trayCount.textContent = inTray ? inTray + " left" : "all placed";
    }

    // ---------- Toast ----------
    function showToast(msg, ok) {
        clearTimeout(toastTimer);
        toast.textContent = msg;
        toast.className = "toast show " + (ok ? "correct" : "wrong");
        toastTimer = setTimeout(() => (toast.className = "toast"), 3200);
    }

    // ---------- Modals ----------
    function openModal(html, color) {
        modalContent.innerHTML = html;
        modalBox.className = "modal" + (color ? " " + color : "");
        modalOverlay.classList.add("show");
    }
    function closeModal() { modalOverlay.classList.remove("show"); }

    document.getElementById("modalClose").addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { closeModal(); resultsOverlay.classList.remove("show"); }
    });

    function showScenarioModal(item) {
        openModal(
            '<div class="modal-kicker">Scenario</div>' +
            "<h3>" + item.scenario.title + "</h3>" +
            "<p>" + item.scenario.text + "</p>" +
            '<p class="rule-line">Decide: must the output be Precise or is Average fine? And if it\'s wrong — Small or Large consequences?</p>'
        );
    }

    function showExplainModal(item) {
        const q = QUADRANTS[item.scenario.answer];
        openModal(
            '<div class="modal-kicker">Why this is ' + q.emoji + " " + q.name + "</div>" +
            "<h3>" + item.scenario.title + "</h3>" +
            "<p>" + item.scenario.text + "</p>" +
            "<p>" + item.scenario.explain + "</p>",
            q.color
        );
    }

    function showHintModal(item) {
        const picked = item.placedIn.split("-");
        const answer = item.scenario.answer.split("-");
        const precisionWrong = picked[0] !== answer[0];
        const consequenceWrong = picked[1] !== answer[1];

        let hint;
        if (precisionWrong && consequenceWrong) {
            hint = "Both axes need a rethink. How exact does the output really have to be — and if it's wrong, who or what actually gets hurt?";
        } else if (precisionWrong) {
            hint = answer[0] === "precise"
                ? "You've judged the blast radius right — but is 'roughly right' genuinely good enough here? Think about whether one wrong digit, name, or clause breaks the task."
                : "You've judged the blast radius right — but does this output really need to be exact? Ideas, drafts, and framing can be average and still do their job.";
        } else {
            hint = answer[1] === "large"
                ? "You've judged the precision right — now think bigger about consequences. Who sees this? Could it harm a person, breach a rule, or cost real money?"
                : "You've judged the precision right — but is the blast radius really that big? If a mistake here is cheap to catch and fix, the consequences are small.";
        }

        openModal(
            '<div class="modal-kicker">Hint — not quite</div>' +
            "<h3>" + item.scenario.title + "</h3>" +
            "<p>" + item.scenario.text + "</p>" +
            "<p>" + hint + "</p>" +
            '<p class="rule-line">Drag the card to a different quadrant to try again. First attempts are what count for your score.</p>'
        );
    }

    function showQuadrantModal(key) {
        const q = QUADRANTS[key];
        openModal(
            '<div class="modal-kicker">Trust level</div>' +
            "<h3>" + q.emoji + " " + q.name + "</h3>" +
            "<p><em>" + q.axes + "</em></p>" +
            "<p>" + q.detail.summary + "</p>" +
            "<ul>" + q.detail.examples.map((x) => "<li>" + x + "</li>").join("") + "</ul>" +
            '<p class="rule-line">' + q.detail.rule + "</p>",
            q.color
        );
    }

    // ---------- Results ----------
    function showResults() {
        const total = items.length;
        const score = items.filter((i) => i.firstTryCorrect).length;
        const pct = Math.round((score / total) * 100);

        const prevBest = parseInt(localStorage.getItem(bestKey(domain.id)) || "-1", 10);
        const isBest = score > prevBest;
        if (isBest) localStorage.setItem(bestKey(domain.id), String(score));

        document.getElementById("scoreBig").textContent = score + " / " + total;

        let msg;
        if (pct === 100) msg = "Perfect. You place tasks like someone who will never be the next Deloitte headline. The grid is instinct now — use it before every AI session.";
        else if (pct >= 80) msg = "Strong placement instincts. Review the ones you missed below — they're usually the sneaky yellow-quadrant tasks that feel green.";
        else if (pct >= 60) msg = "Getting there. The most common mistake is treating red-quadrant tasks — safety, regulations, money, anything touching a person — as if they were green.";
        else msg = "The grid needs practice. Key rule: if a wrong answer could harm a person, breach a regulation, or cost money — it's red, and a human checks it before anything ships.";
        msg += " Remember: trust is about the task, not the tool.";
        if (isBest && prevBest >= 0) msg += " 🏆 New best score for this domain!";
        document.getElementById("scoreText").textContent = msg;

        const recap = document.getElementById("recap");
        recap.innerHTML = "";
        items.forEach((item) => {
            const q = QUADRANTS[item.scenario.answer];
            const row = document.createElement("div");
            row.className = "recap-row";
            row.innerHTML =
                '<span class="mark ' + (item.firstTryCorrect ? "ok" : "miss") + '">' + (item.firstTryCorrect ? "✓" : "✗") + "</span>" +
                '<span class="r-title">' + item.scenario.title + "</span>" +
                '<span class="r-quad">' + q.emoji + " " + q.name + "</span>";
            row.style.cursor = "pointer";
            row.title = "Tap for the explanation";
            row.addEventListener("click", () => showExplainModal(item));
            recap.appendChild(row);
        });

        resultsOverlay.classList.add("show");
    }

    document.getElementById("againBtn").addEventListener("click", () => {
        resultsOverlay.classList.remove("show");
        startGame(domain);
    });
    document.getElementById("domainsBtn").addEventListener("click", goHome);
    document.getElementById("backBtn").addEventListener("click", goHome);

    function goHome() {
        resultsOverlay.classList.remove("show");
        gameScreen.style.display = "none";
        startScreen.style.display = "block";
        if (location.search) history.replaceState(null, "", location.pathname);
        renderDomainGrid(); // refresh best scores
    }

    // ---------- Init ----------
    renderDomainGrid();

    // Deep link: ?domain=<id> jumps straight into that pack (e.g. ?domain=food-science)
    const wanted = new URLSearchParams(location.search).get("domain");
    const preset = wanted && DOMAINS.find((d) => d.id === wanted);
    if (preset) startGame(preset);
})();
