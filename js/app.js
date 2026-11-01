// Trust Tool: card tray + drag/tap placement + first-pass scoring.

(function () {
    "use strict";

    // ---------- DOM ----------
    const domainSelect = document.getElementById("domainSelect");
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
    let domain = null;
    let items = [];
    let selectedItem = null;
    let draggedItem = null;
    let toastTimer = null;

    // ---------- Pack picker ----------
    const DOMAIN_GROUPS = [
        {
            label: "Professional firms",
            ids: ["business", "consulting", "executives", "medical", "information-security", "investing", "supply-chain", "marketing"]
        },
        {
            label: "Education",
            ids: ["researcher", "lecturer", "professional-staff", "academic"]
        },
        {
            label: "Technical and industry",
            ids: ["programming", "food-science", "mining", "science"]
        }
    ];

    function populatePacks() {
        domainSelect.innerHTML = "";
        DOMAIN_GROUPS.forEach((group) => {
            const optgroup = document.createElement("optgroup");
            optgroup.label = group.label;
            group.ids.forEach((id) => {
                const d = DOMAINS.find((x) => x.id === id);
                if (!d) return;
                const option = document.createElement("option");
                option.value = d.id;
                option.textContent = d.name;
                optgroup.appendChild(option);
            });
            domainSelect.appendChild(optgroup);
        });
    }

    // ---------- Game setup ----------
    function startGame(d) {
        domain = d;
        selectedItem = null;
        draggedItem = null;
        domainSelect.value = d.id;

        const shuffled = d.scenarios.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        items = shuffled.map((s) => ({
            scenario: s,
            el: null,
            status: "tray",
            placedIn: null,
            attempts: 0,
            firstTryCorrect: false
        }));

        document.querySelectorAll(".quadrant .cards").forEach((c) => (c.innerHTML = ""));
        trayCards.innerHTML = "";
        items.forEach((item) => {
            item.el = buildCard(item);
            trayCards.appendChild(item.el);
        });

        updateCounters();
        resultsOverlay.classList.remove("show");
    }

    // ---------- Card construction ----------
    function buildCard(item) {
        const el = document.createElement("div");
        el.className = "mini-card";
        el.draggable = true;
        el.tabIndex = 0;
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", item.scenario.title + " — press Enter to pick up, then arrow keys and Enter to place");

        const title = document.createElement("span");
        title.className = "card-title";
        title.textContent = item.scenario.title;
        el.appendChild(title);

        const info = document.createElement("button");
        info.className = "icon-btn";
        info.title = "Read the full scenario";
        info.setAttribute("aria-label", "Read the full scenario: " + item.scenario.title);
        info.textContent = "ⓘ";
        info.addEventListener("click", (e) => {
            e.stopPropagation();
            showScenarioModal(item);
        });
        el.appendChild(info);

        el.addEventListener("click", () => onCardTap(item));

        el.addEventListener("keydown", (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            if (e.key === "Enter" && selectedItem === item && kbQuadIndex !== -1) return;
            e.preventDefault();
            e.stopPropagation();
            onCardTap(item);
        });

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
        badge.setAttribute("aria-label", ok ? "Correct — read why" : "Wrong — get a hint");
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
        if (!on) kbQuadIndex = -1;
    }

    // ---------- Keyboard placement ----------
    const QUAD_ORDER = ["average-large", "precise-large", "average-small", "precise-small"];
    let kbQuadIndex = -1;

    function highlightKbQuad() {
        document.querySelectorAll(".quadrant").forEach((q, i) => {
            q.classList.toggle("drag-over", i === kbQuadIndex);
        });
    }

    document.addEventListener("keydown", (e) => {
        if (!selectedItem) return;
        if (modalOverlay.classList.contains("show") || resultsOverlay.classList.contains("show")) return;

        if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            if (kbQuadIndex === -1) kbQuadIndex = 0;
            else if (e.key === "ArrowLeft" || e.key === "ArrowRight") kbQuadIndex ^= 1;
            else kbQuadIndex ^= 2;
            highlightKbQuad();
        } else if (e.key === "Enter" && kbQuadIndex !== -1) {
            e.preventDefault();
            placeCard(selectedItem, QUAD_ORDER[kbQuadIndex]);
        }
    });

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
        if (item.placedIn === quadrantKey) return;

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
        void item.el.offsetWidth;
        item.el.classList.add(correct ? "pop" : "shake");

        showToast(
            correct
                ? "✓ Correct" + (item.attempts === 1 ? " — first try." : ".") + " Tap the ✓ for why."
                : "✗ Not quite. Tap the ✗ for a hint, then move it somewhere else.",
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
        if (e.key !== "Escape") return;
        closeModal();
        resultsOverlay.classList.remove("show");
        if (selectedItem) {
            selectedItem.el.classList.remove("selected");
            selectedItem = null;
            setDropReady(false);
        }
    });

    function showHowItWorks() {
        openModal(
            '<div class="modal-kicker">How it works</div>' +
            "<h3>Place the task, not the tool.</h3>" +
            "<p>Each scenario is a card. Decide how precise the output must be and how large the consequences are if it is wrong. Drag the card to that quadrant, or tap the card and then the quadrant.</p>" +
            "<p>A correct placement locks in. A wrong placement gives a hint, and you can move the card again. Only your first attempt counts toward the first-pass accuracy.</p>" +
            "<p>Tap the info icon on any card or quadrant for the full scenario and the reasoning.</p>" +
            '<p class="rule-line">Green: light review. Yellow: verify. Red: a person signs off.</p>'
        );
    }

    function showScenarioModal(item) {
        openModal(
            '<div class="modal-kicker">Scenario</div>' +
            "<h3>" + item.scenario.title + "</h3>" +
            "<p>" + item.scenario.text + "</p>" +
            '<p class="rule-line">Decide: must the output be precise or is average fine? And if it is wrong, are the consequences small or large?</p>'
        );
    }

    function showExplainModal(item) {
        const q = QUADRANTS[item.scenario.answer];
        openModal(
            '<div class="modal-kicker">Why this is ' + q.name + "</div>" +
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
            hint = "Both axes need a rethink. How exact does the output really have to be, and if it is wrong, who or what actually gets hurt?";
        } else if (precisionWrong) {
            hint = answer[0] === "precise"
                ? "You judged the blast radius right, but is roughly right genuinely good enough here? Think about whether one wrong digit, name, or clause breaks the task."
                : "You judged the blast radius right, but does this output really need to be exact? Ideas, drafts, and framing can be average and still do their job.";
        } else {
            hint = answer[1] === "large"
                ? "You judged the precision right. Now think bigger about consequences. Who sees this? Could it harm a person, breach a rule, or cost real money?"
                : "You judged the precision right, but is the blast radius really that big? If a mistake is cheap to catch and fix, the consequences are small.";
        }

        openModal(
            '<div class="modal-kicker">Hint — not quite</div>' +
            "<h3>" + item.scenario.title + "</h3>" +
            "<p>" + item.scenario.text + "</p>" +
            "<p>" + hint + "</p>" +
            '<p class="rule-line">Move the card to a different quadrant to try again. First attempts are what count for the score.</p>'
        );
    }

    function showQuadrantModal(key) {
        const q = QUADRANTS[key];
        openModal(
            '<div class="modal-kicker">Trust level</div>' +
            "<h3>" + q.name + "</h3>" +
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

        document.getElementById("scoreBig").textContent = score + " / " + total;

        let msg;
        if (pct === 100) msg = "Perfect. The grid is instinct now. Use it before every AI session.";
        else if (pct >= 80) msg = "Strong placement instincts. Review the ones you missed below. They are usually the sneaky yellow-quadrant tasks that feel green.";
        else if (pct >= 60) msg = "Getting there. The most common mistake is treating red-quadrant tasks, such as safety, regulations, money, or anything touching a person, as if they were green.";
        else msg = "The grid needs practice. Key rule: if a wrong answer could harm a person, breach a regulation, or cost money, it is red, and a human checks it before anything ships.";
        msg += " Trust is about the task, not the tool.";
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
                '<span class="r-quad">' + q.name + "</span>";
            row.style.cursor = "pointer";
            row.title = "Tap for the explanation";
            row.addEventListener("click", () => showExplainModal(item));
            recap.appendChild(row);
        });

        resultsOverlay.classList.add("show");
    }

    // ---------- Event wiring ----------
    document.getElementById("howBtn").addEventListener("click", showHowItWorks);
    document.getElementById("anotherBtn").addEventListener("click", () => {
        resultsOverlay.classList.remove("show");
        domainSelect.focus();
        if (typeof domainSelect.showPicker === "function") {
            try { domainSelect.showPicker(); } catch (e) { /* ignore */ }
        }
    });
    domainSelect.addEventListener("change", () => {
        const next = DOMAINS.find((d) => d.id === domainSelect.value);
        if (next) startGame(next);
    });

    // ---------- Init ----------
    populatePacks();

    const wanted = new URLSearchParams(location.search).get("domain");
    const preset = wanted && DOMAINS.find((d) => d.id === wanted);
    const defaultDomain = DOMAINS.find((d) => d.id === "business") || DOMAINS[0];
    startGame(preset || defaultDomain);
})();
