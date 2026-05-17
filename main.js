let currentBuild = {
    cpu: null, motherboard: null, ram: null, gpu: null, storage: null, psu: null
};
let playerMoney = 20000000;
let playerLevel = 1;
let playerXP = 0;
let xpNeeded = 100;
let currentClient = null;
let dragData = null;

function formatRupiah(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
}

function updateUIStats() {
    document.getElementById("money").innerText = formatRupiah(playerMoney);
    document.getElementById("level").innerText = playerLevel;
    document.getElementById("xp").innerText = playerXP;
    document.getElementById("xpNext").innerText = xpNeeded;
}

function saveGame() {
    const gameState = {
        money: playerMoney,
        level: playerLevel,
        xp: playerXP,
        build: currentBuild,
        inventory: inventory
    };
    localStorage.setItem("pcCreatorSave", JSON.stringify(gameState));
    saveStorage();
}

function loadGame() {
    const saved = localStorage.getItem("pcCreatorSave");
    if (saved) {
        const state = JSON.parse(saved);
        playerMoney = state.money;
        playerLevel = state.level;
        playerXP = state.xp;
        currentBuild = state.build || { cpu: null, motherboard: null, ram: null, gpu: null, storage: null, psu: null };
        inventory = state.inventory || [];
        saveStorage();
    } else {
        inventory = [];
    }
    updateUIStats();
    renderBuildSlots();
    renderShop();
    renderStorage();
    updateCompatibilityMessage();
}

function addXP(amount) {
    playerXP += amount;
    while (playerXP >= xpNeeded) {
        playerXP -= xpNeeded;
        playerLevel++;
        xpNeeded = Math.floor(100 + (playerLevel-1) * 25);
        showTemporaryMessage(`🎉 LEVEL UP! Sekarang Level ${playerLevel} 🎉`, "#4a7c59");
    }
    updateUIStats();
    saveGame();
}

async function randomReward() {
    const rewardCount = Math.floor(Math.random() * 3); // 0,1,2
    if (rewardCount === 0) return [];
    const shuffled = [...componentsDatabase];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const rewards = shuffled.slice(0, rewardCount);
    rewards.forEach(comp => addComponentToStorage({ ...comp }));
    return rewards;
}

function evaluateBuild() {
    if (!currentClient) {
        document.getElementById("gameMessage").innerHTML = "Tidak ada klien aktif!";
        return;
    }
    const build = currentBuild;
    const missing = [];
    if (!build.cpu) missing.push("CPU");
    if (!build.motherboard) missing.push("Motherboard");
    if (!build.ram) missing.push("RAM");
    if (!build.gpu) missing.push("GPU");
    if (!build.storage) missing.push("Storage");
    if (!build.psu) missing.push("PSU");
    if (missing.length > 0) {
        showTemporaryMessage(`PC belum lengkap: ${missing.join(", ")}`, "#682c3c");
        return;
    }
    let errors = [];
    if (build.cpu.socket !== build.motherboard.socket) errors.push("Socket tidak cocok");
    let totalPower = (build.cpu.power||0) + (build.motherboard.power||0) + (build.ram.power||0) + (build.gpu.power||0) + (build.storage.power||0);
    if (totalPower > build.psu.wattage) errors.push(`Daya PSU kurang (${totalPower}W > ${build.psu.wattage}W)`);
    const ramCap = build.ram.capacity || 0;
    if (ramCap < currentClient.minRam) errors.push(`RAM minimal ${currentClient.minRam}GB, saat ini ${ramCap}GB`);
    const tierRank = { low:0, mid:1, high:2, ultra:3 };
    if (tierRank[build.gpu.tier] < tierRank[currentClient.minGpuTier]) errors.push(`GPU terlalu lemah, butuh tier ${currentClient.minGpuTier}`);
    const totalPrice = (build.cpu.price||0)+(build.motherboard.price||0)+(build.ram.price||0)+(build.gpu.price||0)+(build.storage.price||0)+(build.psu.price||0);
    if (totalPrice > currentClient.budget) errors.push(`Melebihi budget ${formatRupiah(currentClient.budget)}`);
    if (errors.length > 0) {
        document.getElementById("gameMessage").innerHTML = "❌ Klien menolak: " + errors.join("; ");
        document.getElementById("gameMessage").style.background = "#682c3c";
        return;
    }
    const xpGain = Math.floor(Math.random() * 11) + 5;
    addXP(xpGain);
    const rewardComps = await randomReward();
    let rewardMsg = "";
    if (rewardComps.length > 0) {
        rewardMsg = ` + Mendapat komponen: ${rewardComps.map(c=>c.name).join(", ")}`;
    }
    document.getElementById("gameMessage").innerHTML = `🎉 Pesanan selesai! +${xpGain} XP. ${rewardMsg} 🎉`;
    document.getElementById("gameMessage").style.background = "#216b49";
    playerMoney += currentClient.budget;
    updateUIStats();
    saveGame();
    nextClient();
}

function nextClient() {
    currentClient = getRandomClient();
    updateClientUI();
    renderBuildSlots();
    updateCompatibilityMessage();
}

function skipClient() {
    if (playerMoney >= 500000) {
        playerMoney -= 500000;
        updateUIStats();
        nextClient();
        showTemporaryMessage("Klien diganti! Biaya 500k.", "#3a5a7a");
        saveGame();
    } else {
        showTemporaryMessage("Uang tidak cukup untuk skip!", "#a55a3a");
    }
}

function updateClientUI() {
    if (!currentClient) return;
    document.getElementById("clientName").innerHTML = `${currentClient.avatar || "🧑‍💼"} Klien: ${currentClient.name}`;
    document.getElementById("clientRequest").innerHTML = `💰 Budget: ${formatRupiah(currentClient.budget)} | Kebutuhan: ${currentClient.usage}`;
    document.getElementById("clientRequirements").innerHTML = `📋 Minimal: RAM ${currentClient.minRam}GB, GPU tier ${currentClient.minGpuTier}`;
}

function renderShop() {
    const container = document.getElementById("shopComponents");
    const category = document.getElementById("categoryFilter").value;
    let filtered = componentsDatabase;
    if (category !== "all") {
        filtered = componentsDatabase.filter(c => c.category === category);
    }
    container.innerHTML = "";
    filtered.forEach(comp => {
        const card = document.createElement("div");
        card.className = "comp-card";
        card.setAttribute("draggable", "true");
        card.setAttribute("data-component", JSON.stringify(comp));
        card.innerHTML = `
            <div class="comp-name">${comp.name}</div>
            <div class="comp-details">
                <span>${comp.category.toUpperCase()} ${comp.socket ? `[${comp.socket}]` : ""} ${comp.wattage ? comp.wattage+"W" : ""} ${comp.capacity ? comp.capacity+"GB" : ""}</span>
                <span class="comp-price">${formatRupiah(comp.price)}</span>
            </div>
        `;
        card.addEventListener("dragstart", (e) => {
            dragData = { type: "shop", component: comp };
            e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
            e.dataTransfer.effectAllowed = "copy";
        });
        container.appendChild(card);
    });
}

function handleDragStart(e) {
    const target = e.target.closest(".comp-card");
    if (!target) return;
    if (target.getAttribute("data-from") === "storage") {
        const idx = target.getAttribute("data-component-idx");
        dragData = { type: "storage", index: parseInt(idx) };
    } else {
        const compData = target.getAttribute("data-component");
        if (compData) dragData = { type: "shop", component: JSON.parse(compData) };
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(dragData));
}
function handleDragEnd(e) { dragData = null; }

function setupDragDropSlots() {
    const slots = document.querySelectorAll(".slot-item");
    slots.forEach(slot => {
        slot.addEventListener("dragover", (e) => {
            e.preventDefault();
            slot.classList.add("drag-over");
        });
        slot.addEventListener("dragleave", () => {
            slot.classList.remove("drag-over");
        });
        slot.addEventListener("drop", (e) => {
            e.preventDefault();
            slot.classList.remove("drag-over");
            const slotKey = slot.getAttribute("data-slot-key");
            if (!dragData) return;
            if (dragData.type === "shop") {
                const comp = dragData.component;
                if (playerMoney >= comp.price) {
                    if (tryPlaceComponent(slotKey, comp)) {
                        playerMoney -= comp.price;
                        updateUIStats();
                        saveGame();
                        showTemporaryMessage(`Membeli ${comp.name}`, "#3a6e4a");
                    } else {
                        showTemporaryMessage(`Slot ${slotKey} tidak bisa dipasang komponen ini (kompatibilitas?)`, "#a55a3a");
                    }
                } else {
                    showTemporaryMessage("Uang tidak cukup!", "#a55a3a");
                }
            } else if (dragData.type === "storage") {
                const comp = inventory[dragData.index];
                if (comp && tryPlaceComponent(slotKey, comp)) {
                    removeComponentFromStorage(dragData.index);
                    saveGame();
                    showTemporaryMessage(`Memasang ${comp.name} dari storage`, "#3a6e4a");
                } else {
                    showTemporaryMessage("Gagal memasang komponen dari storage", "#a55a3a");
                }
            }
            renderBuildSlots();
            updateCompatibilityMessage();
            dragData = null;
        });
    });
}

function tryPlaceComponent(slotKey, comp) {
    const categoryMap = {
        cpu: "cpu", motherboard: "motherboard", ram: "ram", gpu: "gpu", storage: "storage", psu: "psu"
    };
    const expectedCat = categoryMap[slotKey];
    if (comp.category !== expectedCat) return false;
    if (currentBuild[slotKey] !== null) return false;
    if (slotKey === "cpu" && currentBuild.motherboard && currentBuild.motherboard.socket !== comp.socket) return false;
    if (slotKey === "motherboard" && currentBuild.cpu && currentBuild.cpu.socket !== comp.socket) return false;
    if (slotKey === "ram" && currentBuild.motherboard && currentBuild.motherboard.ramType && currentBuild.motherboard.ramType !== comp.ramType) return false;
    currentBuild[slotKey] = comp;
    return true;
}

function removeFromBuild(slotKey) {
    currentBuild[slotKey] = null;
    renderBuildSlots();
    updateCompatibilityMessage();
    saveGame();
}

function renderBuildSlots() {
    const container = document.getElementById("pcSlots");
    const slots = [
        { label: "CPU", key: "cpu", value: currentBuild.cpu?.name || "Kosong", isEmpty: !currentBuild.cpu },
        { label: "Motherboard", key: "motherboard", value: currentBuild.motherboard?.name || "Kosong", isEmpty: !currentBuild.motherboard },
        { label: "RAM", key: "ram", value: currentBuild.ram?.name || "Kosong", isEmpty: !currentBuild.ram },
        { label: "GPU", key: "gpu", value: currentBuild.gpu?.name || "Kosong", isEmpty: !currentBuild.gpu },
        { label: "Storage", key: "storage", value: currentBuild.storage?.name || "Kosong", isEmpty: !currentBuild.storage },
        { label: "PSU", key: "psu", value: currentBuild.psu?.name || "Kosong", isEmpty: !currentBuild.psu }
    ];
    container.innerHTML = "";
    slots.forEach(slot => {
        const div = document.createElement("div");
        div.className = "slot-item";
        div.setAttribute("data-slot-key", slot.key);
        div.innerHTML = `
            <span class="slot-label">${slot.label}</span>
            <span class="slot-value ${slot.isEmpty ? 'empty-slot' : ''}">${slot.value}</span>
            ${!slot.isEmpty ? `<button class="mini-remove" data-key="${slot.key}">✖</button>` : ""}
        `;
        if (!slot.isEmpty) {
            const btn = div.querySelector(".mini-remove");
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                removeFromBuild(slot.key);
            });
        }
        container.appendChild(div);
    });
    setupDragDropSlots();
    updateBuildPriceAndPower();
}

function updateBuildPriceAndPower() {
    let total = 0, power = 0, psuWatt = 0;
    for (let key in currentBuild) {
        const part = currentBuild[key];
        if (part) {
            total += part.price;
            if (part.power) power += part.power;
            if (key === "psu" && part.wattage) psuWatt = part.wattage;
        }
    }
    document.getElementById("buildPrice").innerText = formatRupiah(total);
    document.getElementById("buildPower").innerText = power;
    document.getElementById("buildPsuWatt").innerText = psuWatt;
}

function updateCompatibilityMessage() {
    let msg = "";
    const cpu = currentBuild.cpu, mobo = currentBuild.motherboard, psu = currentBuild.psu;
    let power = 0;
    for (let key in currentBuild) {
        if (currentBuild[key]?.power) power += currentBuild[key].power;
    }
    if (cpu && mobo && cpu.socket !== mobo.socket) msg = "❌ Socket tidak cocok!";
    else if (psu && power > psu.wattage) msg = `⚠️ Daya PSU kurang (${power}W > ${psu.wattage}W)`;
    else msg = "✅ Kompatibilitas OK. Serahkan ke klien!";
    document.getElementById("gameMessage").innerHTML = msg;
    document.getElementById("gameMessage").style.background = msg.includes("❌") ? "#682c3c" : (msg.includes("⚠️") ? "#7a5a2a" : "#1b4d3e");
}

function resetBuild() {
    currentBuild = { cpu: null, motherboard: null, ram: null, gpu: null, storage: null, psu: null };
    renderBuildSlots();
    updateCompatibilityMessage();
    saveGame();
    showTemporaryMessage("Rakitan direset", "#3a5a7a");
}

function showTemporaryMessage(msg, bg) {
    const msgDiv = document.getElementById("gameMessage");
    msgDiv.innerHTML = msg;
    msgDiv.style.background = bg;
    setTimeout(() => {
        if (document.getElementById("gameMessage").innerHTML === msg) updateCompatibilityMessage();
    }, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    currentClient = getRandomClient();
    updateClientUI();
    renderShop();
    renderStorage();
    renderBuildSlots();
    updateUIStats();
    document.getElementById("categoryFilter").addEventListener("change", () => renderShop());
    document.getElementById("evaluateBtn").addEventListener("click", evaluateBuild);
    document.getElementById("resetBuildBtn").addEventListener("click", resetBuild);
    document.getElementById("skipClientBtn").addEventListener("click", skipClient);
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
        });
    });
    window.addEventListener("beforeunload", () => saveGame());
});